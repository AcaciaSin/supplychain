package handlers

import (
	"fmt"
	"math/big"
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
)

func AccountLogin(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	role, err := contractAPI.GetRole(common.HexToAddress(body["addr"].(string)))
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusForbidden, gin.H{
			"msg": "没有找到该账户",
		})
		return
	}
	c.SetCookie("addrRole", role, 3600, "/", "114.115.131.113", false, true)
	c.SetCookie("addr", body["addr"].(string), 3600, "/", "114.115.131.113", false, true)
	sendData(c, http.StatusOK, gin.H{"role": role}, "登录成功")
}

func AccountRegister(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)

	operatorAddr, _ := c.Cookie("addr")
	companyType := &big.Int{}
	companyType.SetUint64(uint64(body["companyType"].(float64)))
	_, receipt, err := contractAPI.Registration(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["addr"].(string)),
		body["role"].(string),
		body["name"].(string),
		companyType,
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "创建失败，可能为1.权限不足, 2.地址已存在, 3.非法 role 类型")
		return
	}
	sendData(c, http.StatusOK, gin.H{"createRoleType": body["role"].(string)}, "创建成功")
}

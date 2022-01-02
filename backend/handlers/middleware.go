package handlers

import (
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
)

func isLogin(c *gin.Context) {
	_, err := c.Cookie("addrRole")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"msg": "未登录",
		})
		return
	}
	c.Next()
}

func isAdmin(c *gin.Context) {
	addr, _ := c.Cookie("addr")
	role, _ := contractAPI.GetRole(common.HexToAddress(addr))
	if role != "admin" {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"msg": "此地址不是管理员",
		})
		return
	}
}

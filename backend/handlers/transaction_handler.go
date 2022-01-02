package handlers

import (
	"math/big"
	"net/http"
	"strconv"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
)

func provideCredit(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	amount := &big.Int{}
	amount.SetUint64(uint64(body["amount"].(float64)))
	operatorAddr, _ := c.Cookie("addr")
	_, receipt, err := contractAPI.ProvideCredit(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["addr"].(string)),
		amount,
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "发放信用点失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{}, "发放信用点成功")
}

func withdrawCredit(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	amount := &big.Int{}
	amount.SetUint64(uint64(body["amount"].(float64)))
	operatorAddr, _ := c.Cookie("addr")
	_, receipt, err := contractAPI.WithdrawCredit(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["addr"].(string)),
		amount,
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status == 22 {
		sendData(c, http.StatusForbidden, gin.H{}, "回收信用点失败，可能原因1.目标信用点不足")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"msg": "回收信用点成功",
	})
}

func provideFunidng(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	amount := &big.Int{}
	amount.SetUint64(uint64(body["amount"].(float64)))
	operatorAddr, _ := c.Cookie("addr")
	_, receipt, err := contractAPI.ProvideFunding(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["addr"].(string)),
		amount,
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "发放资金失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{}, "发放资金成功")
}

func financing(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	amount := &big.Int{}
	amount.SetUint64(uint64(body["amount"].(float64)))
	operatorAddr, _ := c.Cookie("addr")
	billID := &big.Int{}
	billID.SetInt64(0)
	if body["billID"] != nil {
		billID.SetUint64(uint64(body["billID"].(float64)))
	}
	_, receipt, err := contractAPI.Financing(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["bankAddr"].(string)),
		amount,
		body["message"].(string),
		body["billID"] != nil,
		billID,
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "融资申请失败，可能原因1.信用点不足，2.银行不能使用融资功能，3.该账单付款方不是核心企业")
		return
	}
	sendData(c, http.StatusOK, gin.H{}, "融资申请成功")
}

func financingConfirm(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	txID := &big.Int{}
	txID.SetUint64(uint64(body["txID"].(float64)))
	operatorAddr, _ := c.Cookie("addr")
	// 设定一年后到还款日期
	createdDate := time.Now()
	endDate := createdDate.AddDate(1, 0, 0)
	strconv.Itoa(int(createdDate.Unix()))
	_, receipt, err := contractAPI.ConfirmFinancing(
		common.HexToAddress(operatorAddr),
		txID,
		body["accepted"].(bool),
		strconv.Itoa(int(createdDate.Unix())),
		strconv.Itoa(int(endDate.Unix())),
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "融资确认失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{"isAccepted": body["accepted"].(bool)}, "融资确认成功")
}

func repay(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	billID := &big.Int{}
	billID.SetUint64(uint64(body["billID"].(float64)))
	operatorAddr, _ := c.Cookie("addr")
	_, receipt, err := contractAPI.Repay(
		common.HexToAddress(operatorAddr),
		billID,
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "还款失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{"billID": billID}, "还款成功")
}

func transferBill(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	operatorAddr, _ := c.Cookie("addr")
	amount := &big.Int{}
	amount.SetUint64(uint64(body["amount"].(float64)))
	billID := &big.Int{}
	billID.SetUint64(uint64(body["billID"].(float64)))
	createdDate := time.Now()
	endDate := createdDate.AddDate(1, 0, 0)
	_, receipt, err := contractAPI.TransferBill(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["to"].(string)),
		amount,
		body["message"].(string),
		billID,
		strconv.Itoa(int(createdDate.Unix())),
		strconv.Itoa(int(endDate.Unix())),
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "转移账单失败，可能原因1.账单金额不足")
		return
	}
	sendData(c, http.StatusOK, gin.H{}, "转移账单成功")
}

func transferFunding(c *gin.Context) {
	body := make(map[string]interface{})
	c.BindJSON(&body)
	operatorAddr, _ := c.Cookie("addr")
	amount := &big.Int{}
	amount.SetUint64(uint64(body["amount"].(float64)))
	createdDate := time.Now()
	endDate := createdDate.AddDate(1, 0, 0)
	_, receipt, err := contractAPI.TransferFunding(
		common.HexToAddress(operatorAddr),
		common.HexToAddress(body["to"].(string)),
		amount,
		body["message"].(string),
		createdDate.String(),
		endDate.String(),
	)
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		return
	}
	if receipt.Status != 0 {
		sendData(c, http.StatusForbidden, gin.H{}, "签发应收账单失败，可能原因1.核心企业信用点不足")
		return
	}
	sendData(c, http.StatusOK, gin.H{}, "签发应收账单成功")
}

package handlers

import (
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gin-gonic/gin"
)

func getAccountInfo(c *gin.Context) {
	role, _ := c.Cookie("addrRole")
	addr, _ := c.Cookie("addr")
	data := gin.H{}
	if role == "admin" {
		admin, err := contractAPI.GetAdmin()
		if err != nil {
			sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		}
		data = gin.H{"info": admin}
	} else if role == "bank" {
		bank, err := contractAPI.GetBank(common.HexToAddress(addr))
		if err != nil {
			sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		}
		data = gin.H{"info": bank}
	} else if role == "company" {
		company, err := contractAPI.GetCompany(common.HexToAddress(addr))
		if err != nil {
			sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
		}
		data = gin.H{"info": company}
	}
	sendData(c, http.StatusOK, data, "获取账户信息成功")
}

func getAllBanks(c *gin.Context) {
	bank, err := contractAPI.GetAllBanks()
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
	}
	sendData(c, http.StatusOK, gin.H{
		"bank": bank,
	},
		"获取所有银行成功",
	)
}

func getAllTx(c *gin.Context) {
	bank, err := contractAPI.GetAllTx()
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
	}
	sendData(c, http.StatusOK, gin.H{
		"bank": bank,
	},
		"获取所有交易成功",
	)
}

func getNormalCompanies(c *gin.Context) {
	company, err := contractAPI.GetNormalCompanies()
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
	}
	sendData(c, http.StatusOK, gin.H{
		"company": company,
	},
		"获取所有普通企业成功",
	)
}

func getCoreCompanies(c *gin.Context) {
	company, err := contractAPI.GetCoreCompanies()
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
	}
	sendData(c, http.StatusOK, gin.H{
		"company": company,
	},
		"获取所有核心企业成功",
	)
}

func getAllBills(c *gin.Context) {
	bill, err := contractAPI.GetAllBills()
	if err != nil {
		sendData(c, http.StatusInternalServerError, gin.H{}, "区块链执行异常")
	}
	sendData(c, http.StatusOK, gin.H{
		"bank": bill,
	},
		"获取所有账单成功",
	)
}

func getMyTx(c *gin.Context) {
	operatorAddr, _ := c.Cookie("addr")
	tx, err := contractAPI.GetMyTx(common.HexToAddress(operatorAddr))
	if err != nil {
		sendData(c, http.StatusForbidden, gin.H{}, "获取自己相关交易失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{"tansaction": tx}, "获取自己相关交易成功")
}

func getBillFromMe(c *gin.Context) {
	operatorAddr, _ := c.Cookie("addr")
	bill, err := contractAPI.GetBillFrom(common.HexToAddress(operatorAddr))
	if err != nil {
		sendData(c, http.StatusForbidden, gin.H{}, "获取应付账单失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{"bill": bill}, "获取应付账单成功")
}

func getBillToMe(c *gin.Context) {
	operatorAddr, _ := c.Cookie("addr")
	bill, err := contractAPI.GetBillTo(common.HexToAddress(operatorAddr))
	if err != nil {
		sendData(c, http.StatusForbidden, gin.H{}, "获取应收账单失败")
		return
	}
	sendData(c, http.StatusOK, gin.H{"bill": bill}, "获取应收账单成功")
}

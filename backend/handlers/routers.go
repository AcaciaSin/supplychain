package handlers

import (
	"github.com/gin-gonic/gin"
)

func SetRouters(router *gin.Engine) {
	// 账户相关
	account := router.Group("/account")
	{
		account.POST("/login", AccountLogin)
		account.POST("/register", isLogin, AccountRegister)
	}

	// 管理员相关
	admin := router.Group("/admin")
	{
		admin.GET("/", isLogin, AdminTest)
	}

	// 获取信息
	info := router.Group("/info")
	{
		info.GET("", isLogin, getAccountInfo)
		info.GET("/bank", isLogin, getAllBanks)
		info.GET("/tx", isLogin, getAllTx)
		info.GET("/mytx", isLogin, getMyTx)
		info.GET("/bill", isLogin, getAllBills)
		info.GET("/bill/from", isLogin, getBillFromMe)
		info.GET("/bill/to", isLogin, getBillToMe)
		info.GET("/company/normal", isLogin, getNormalCompanies)
		info.GET("/company/core", isLogin, getCoreCompanies)
	}

	// 交易
	transaction := router.Group("/transaction")
	{
		// 信用点，不计入交易的 table 中，只在区块链上记录，即 /info/tx 中不能获取
		transaction.POST("/provide/credit", isLogin, provideCredit)
		transaction.POST("/withdraw/credit", isLogin, withdrawCredit)
		// 资金
		transaction.POST("/provide/funding", isLogin, isAdmin, provideFunidng) // 提供资金
		transaction.POST("/financing", isLogin, financing)                     // 信用点融资或者账单融资
		transaction.POST("/financing/confirm", isLogin, financingConfirm)      // 确认融资
		transaction.POST("/repay", isLogin, repay)                             // 还款
		transaction.POST("/transfer/bill", isLogin, transferBill)              // 账单转让
		transaction.POST("/transfer/funding", isLogin, transferFunding)        //  赊账，签发应收账单
	}

}

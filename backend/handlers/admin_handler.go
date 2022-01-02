package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminTest(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"msg": "管理员测试",
	})
}

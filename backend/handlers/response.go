package handlers

import (
	"github.com/gin-gonic/gin"
)

func sendData(c *gin.Context, status int, data gin.H, message string) {
	data["msg"] = message
	c.JSON(status, data)
}

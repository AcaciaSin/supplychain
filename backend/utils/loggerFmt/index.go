package loggerFmt

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggerFormat(param gin.LogFormatterParams) string {
	return fmt.Sprintf("[%s] - [%s] %s - %s %s\n",
		param.TimeStamp.Format(time.RFC3339),
		param.ClientIP,
		strconv.Itoa(param.StatusCode),
		param.Method,
		param.Request.RequestURI,
	)
}

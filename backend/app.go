package main

import (
	"fmt"
	"log"
	"net/http"
	"supply-chain/config"
	"supply-chain/handlers"

	"supply-chain/utils/fiscoapi"
	"supply-chain/utils/loggerFmt"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.New()
	appConfig := config.LoadConfig()
	// 设置 handlers 里面所使用的 fisco 连接
	handlers.SetFsicoCli(fiscoapi.FiscoInit())
	setLogger(r, &appConfig.LoggerConfig)
	r.Use(Cors())

	runServer(r, &appConfig.ServerConfig)
}

func setLogger(r *gin.Engine, loggerConfig *config.LoggerConfig) {
	gin.DisableConsoleColor()
	r.Use(gin.LoggerWithFormatter(loggerFmt.LoggerFormat))
	r.Use(gin.Recovery())
}

func runServer(r *gin.Engine, sc *config.ServerConfig) {
	// TODO: 改用 config 控制是否为发行模式
	// gin.SetMode(gin.ReleaseMode)
	handlers.SetRouters(r)
	url := fmt.Sprintf(":%d", sc.Port)
	r.Run(url)
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		origin := c.Request.Header.Get("Origin") //请求头部
		if origin != "" {
			//接收客户端发送的origin （重要！）
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			//服务器支持的所有跨域请求的方法
			c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE,UPDATE")
			//允许跨域设置可以返回其他子段，可以自定义字段
			c.Header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-CSRF-Token, Token,session")
			// 允许浏览器（客户端）可以解析的头部 （重要）
			c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers")
			//设置缓存时间
			c.Header("Access-Control-Max-Age", "172800")
			//允许客户端传递校验信息比如 cookie (重要)
			c.Header("Access-Control-Allow-Credentials", "true")
		}

		//允许类型校验
		if method == "OPTIONS" {
			c.JSON(http.StatusOK, "ok!")
		}

		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic info is: %v", err)
			}
		}()

		c.Next()
	}
}

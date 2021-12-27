package main

import (
	"fmt"
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

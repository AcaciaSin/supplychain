package fiscoapi

import (
	"log"

	"github.com/FISCO-BCOS/go-sdk/client"
	"github.com/FISCO-BCOS/go-sdk/conf"
)

// 读取 fisco 配置并连接到节点
func FiscoInit() *client.Client {
	config, err := conf.ParseConfigFile("utils/fiscoapi/config.toml")
	if err != nil {
		log.Fatalf("ParseConfigFile failed, err: %v", err)
	}
	client, err := client.Dial(&config[0])
	if err != nil {
		log.Fatal(err)
	}
	return client
}

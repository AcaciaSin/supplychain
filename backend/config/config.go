package config

type Config struct {
	ServerConfig ServerConfig
	LoggerConfig LoggerConfig
}

type ServerConfig struct {
	Port uint16 `json:"port"`
	Host string `json:"host"`
}

type LoggerConfig struct {
	LogFilePath string `json:"log_file_path"`
}

func LoadConfig() *Config {
	sc := ServerConfig{
		Port: 8000,
		Host: "localhost",
	}
	logger := LoggerConfig{
		LogFilePath: "temp/log/",
	}
	return &Config{
		ServerConfig: sc,
		LoggerConfig: logger,
	}
}

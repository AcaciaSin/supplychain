```
测试链

deploy SupplyChain 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 test

管理员:	0x54e42c4648a236e9557a0f30484155d7b2cf94b1
银行1:	0x808f4a69b4095f01a890abc4566d7919949d150e
银行2: 	0xb1fc7c5b13559c2a83ea0b72706588c1d760c4f8
核心企业1: 0x30fc54fa96fcb5bad30a57d49e591aa7b0a380e1
核心企业2: 0x39460f9d8764bfb811bd40563e10ee224dbe588b
普通企业1:	0xa62e44ed39588503f0f75865be0bd5a0ca5c84e6
普通企业2:	0xaddd74aab673b308bdcc07c61554a7b2a27ae28c

注册
call SupplyChain latest registration 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1511 bank 银行1 0
call SupplyChain latest registration 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1512 bank 银行2 0

提供信用值
call SupplyChain latest provideCredit 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1511 200
call SupplyChain latest provideCredit 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1512  1000

call SupplyChain latest getAllBanks



// 普通企业

call SupplyChain latest registration 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1503 company company 0

call SupplyChain latest provideCredit 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1503 200

call SupplyChain latest getNormalCompanies

// 核心企业

call SupplyChain latest registration 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1513 company company1 1

call SupplyChain latest provideCredit 0x54e42c4648a236e9557a0f30484155d7b2cf94b1 0x808f4a69b4095f01a890abc4566d7919949d1513 200

call SupplyChain latest getCoreCompanies
```
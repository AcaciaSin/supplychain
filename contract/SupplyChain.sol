pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

import "./Table.sol";

contract SupplyChain {
    
    // 管理员结构
    struct Administrator {
        address addr;			// 管理员地址
        uint256 creditProvided;	// 管理员发放的信用值数目
    }
    
    // 银行结构
    struct Bank {
        address addr;		// 地址
        string  name;		// 名称
        uint256 credit;		// 信用值
        uint256 funding;	// 可用资金
    }
    
    // 企业结构
    struct Company {
        address addr;			// 地址
        string  name;			// 名称
        uint256 companyType;	// 企业类型
        uint256 credit;			// 信用值
        uint256 funding;	// 可用资金
    }
    uint256 companyTypeNormal = 0;  // 普通企业
    uint256 companyTypeCore = 1;    // 核心企业

    // 交易结构
    struct Transaction {
        uint256 txID;       	// 交易 ID
        address from;	    	// 付款人地址
        address to;		    	// 收款人地址
        uint256 amount;     	// 交易总额
        string	message;		// 对该交易的一些额外备注信息
        
        uint256 txType;     	// 交易类型
        uint256 txState;		// 交易状态
        uint256 billID;			// 使用账单融资时所关联的 billID
    }

    uint256 txTypeNormal = 0;           // 正常交易
    uint256 txTypeCreditFinacing = 1; 	// 使用信用点融资
    uint256 txTypeBillFinacing = 2; 	// 使用账单融资

    uint256 txStatePending = 0;		// 正在处理
    uint256 txStateRefused = 1;		// 拒绝本次交易
    uint256 txStateAccepted = 2;	// 接收本次交易
    uint256 txTypeRepayment = 3;	// 还账
    
    // 账单结构
    struct Bill {
        uint256 billID;			// 账单 ID
        address from;	    	// 付款人地址
        address to;		    	// 收款人地址
        uint256 amount;			// 账单额
        string 	createdDate;	// 创建日期
        string 	endDate;		// 还款日期
        string	message;		// 账单备注信息
        
        uint256 lock;	    	// 是否锁定，表示该账单是否用于进行转移操作
        uint256 billState;		// 账单状态
        uint256 billType;		// 账单类型，只有付款人为核心企业才能用于融资
    }

    uint256 billStateUnpaid = 0;	// 账单未还
    uint256 billStatePaid = 1;	// 账单已还

    uint256 billUnlocked = 0;
    uint256 billLocked = 1;

    uint256 billTypeNormal = 0; // 普通账单
    uint256 billTypeCore = 1;	// 核心企业为付款人的账单

    // 以下为方便系统操作使用的一些变量和全局变量
    Administrator   systemAdmin;
    Bank            bank;
    Company         company;
    Transaction     transaction;
    Bill            bill;

    string bankTable;
    string companyTable;
    string txTable;
    string billTable;
    string roleTable;
    string addressTable;

    // 需要写入到区块链的事件
    event Registration(address operatorAddr, address addr, string role);
    event ProvideCredit(address operatorAddr, address addr, uint256 amount);
    event ProvideFunding(address operatorAddr, address addr, uint256 amount);
    event WithdrawCredit(address operatorAddr, address addr, uint256 amount);
    event Financing(address operatorAddr, address bankAddr, bool useBill, string message);
    event ConfirmFinancing(address bankAddr, uint256 txID, bool accepted);
    event Repay(address operatorAddr, address addr, uint256 amount);
    event TransferBill(address operatorAddr, address from, address newTo, uint256 billID);
    event TransferFunding(address operatorAddr, address to, uint256 amount);

    // 以下两个处理字符串的函数借用了别人的实现
    function concat(string _base, string _value) internal pure returns (string) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);
        string memory _tmpValue = new string(
            _baseBytes.length + _valueBytes.length
        );
        bytes memory _newValue = bytes(_tmpValue);
        uint256 i;
        uint256 j;
        for (i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }
        for (i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }
        return string(_newValue);
    }

    function toString(address x) private pure returns (string) {
        bytes32 value = bytes32(uint256(x));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint256(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint256(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function equal(string a, string b) private pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(bytes(a)) == keccak256(bytes(b));
        }
    }
    // 合约部署初始化，需要在部署的时候填写管理员的地址，以及加入一个后缀防止与其他合约的表冲突
    constructor (address adminAddr, string name) public {
        // 创建数据库的表，使用后缀防止冲突
        bankTable = concat("Bank", name);
        companyTable = concat("Company", name);
        txTable = concat("Transaction", name);
        billTable = concat("Bill", name);
        roleTable = concat("Role", name);
        addressTable = concat("Address", name);

        TableFactory tf = TableFactory(0x1001);
        tf.createTable(bankTable, "1", "addr,addrStr,name,credit,funding");
        tf.createTable(companyTable, "1", "addr,addrStr,name,companyType,credit,funding");
        tf.createTable(txTable, "1", "txID,from,fromStr,to,toStr,amount,message,txType,txState,billID");
        tf.createTable(billTable, "1", "billID,from,fromStr,to,toStr,amount,createdDate,endDate,message,lock,billState,billType");
        
        // 当做索引
        tf.createTable(roleTable, "addr", "role");

        insertRole(adminAddr, "admin");
        emit Registration(adminAddr, adminAddr, "admin");
        // 设定本系统的管理员
        systemAdmin.addr = adminAddr;
    }
    
    function openTable(string tableName) private view returns (Table) {
        TableFactory tf = TableFactory(0x1001);
        return tf.openTable(tableName);
    }

    function getAdmin() public view returns (Administrator) {
        return systemAdmin;
    }

    // RoleTable
    function getRole(address addr) public view returns (string) {
        Table table = openTable(roleTable);
        Entries entries = table.select(toString(addr), table.newCondition());
        require(entries.size() > 0, "getRole: address is invalid");
        Entry entry = entries.get(0);
        return entry.getString("role");
    }

    function insertRole(address addr, string role) private {
        Table table = openTable(roleTable);
        Entries entries = table.select(toString(addr), table.newCondition());
        require(entries.size() == 0, "insertRole: address exists");
        Entry entry = table.newEntry();
        entry.set("role", role);
        table.insert(toString(addr), entry);
    }

    // companyTable
    function getAllCompanies() public view returns (Company[]) {
        Table table = openTable(companyTable);
        Company[] allCompanies;
        Entries entries = table.select("1", table.newCondition());
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            company.addr = entry.getAddress("addr");
            company.name = entry.getString("name");
            company.companyType = entry.getUInt("companyType");
            company.credit = entry.getUInt("credit");
            company.funding = entry.getUInt("funding");
            allCompanies.push(company);
        }
        return allCompanies;
    } 

    function getCompaniesByType(uint256 companyType) private view returns (Company[]) {
        Table table = openTable(companyTable);
        Company[] allCompanies;
        Condition cond = table.newCondition();
        cond.EQ("companyType", int256(companyType));
        Entries entries = table.select("1", cond);
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            company.addr = entry.getAddress("addr");
            company.name = entry.getString("name");
            company.companyType = entry.getUInt("companyType");
            company.credit = entry.getUInt("credit");
            company.funding = entry.getUInt("funding");
            allCompanies.push(company);
        }
        return allCompanies;
    }   

    function getNormalCompanies() public view returns (Company[]) {
        return getCompaniesByType(companyTypeNormal);
    }

    function getCoreCompanies() public view returns (Company[]) {
        return getCompaniesByType(companyTypeCore);
    }

    function getCompany(address addr) public view returns (Company) {
        Table table = openTable(companyTable);
        Condition cond = table.newCondition();
        cond.EQ("addrStr", toString(addr));
        Entries entries = table.select("1", cond);
        Entry entry = entries.get(0);
        company.addr = addr;
        company.name = entry.getString("name");
        company.companyType = entry.getUInt("companyType");
        company.credit = entry.getUInt("credit");
        company.funding = entry.getUInt("funding");
        return company;
    }

    function insertCompany(address addr, string name, uint256 companyType) public {
        Table table = openTable(companyTable);
        Entry entry = table.newEntry();
        entry.set("addr", addr);
        entry.set("addrStr", toString(addr));
        entry.set("name", name);
        entry.set("companyType", companyType);
        entry.set("credit", uint256(0));
        entry.set("funding", uint256(0));
        table.insert("1", entry);
    }

    function updateCompany(address addr, uint256 credit, bool provide1, uint256 funding, bool provide2) private {
        Table table = openTable(companyTable);
        Condition cond = table.newCondition();
        cond.EQ("addrStr", toString(addr));
        Entry entry = table.newEntry();
        company = getCompany(addr);
        entry.set("addr", company.addr);
        entry.set("addrStr", toString(company.addr));
        entry.set("name", company.name);
        entry.set("companyType", company.companyType);
        if(provide1) {
            entry.set("credit", company.credit + credit);
        } else {
            require(company.credit >= credit, "no enough credit");
            entry.set("credit", company.credit - credit);
        }
        if(provide2) {
            entry.set("funding", company.funding + funding);
        } else {
            require(company.funding >= funding, "no enough funding");
            entry.set("funding", company.funding - funding);
        }
        table.update("1", entry, cond);
    }

    // bankTable
    function getAllBanks() public view returns (Bank[]) {
        Table table = openTable(bankTable);
        Bank[] allBank;
        Entries entries = table.select("1", table.newCondition());
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            bank.addr = entry.getAddress("addr");
            bank.name = entry.getString("name");
            bank.credit = entry.getUInt("credit");
            bank.funding = entry.getUInt("funding");
            allBank.push(bank);
        }
        return allBank;
    }

    function getBank(address addr) public view returns (Bank) {
        Table table = openTable(bankTable);
        Condition cond = table.newCondition();
        cond.EQ("addrStr", toString(addr));
        Entries entries = table.select("1", cond);
        Entry entry = entries.get(0);
        bank.addr = addr;
        bank.name = entry.getString("name");
        bank.credit = entry.getUInt("credit");
        bank.funding = entry.getUInt("funding");
        return bank;
    }

    function insertBank(address addr, string name) private {
        Table table = openTable(bankTable);
        Entry entry = table.newEntry();
        entry.set("addr", addr);
        entry.set("addrStr", toString(addr));
        entry.set("name", name);
        entry.set("credit", uint256(0));
        entry.set("funding", uint256(0));
        table.insert("1", entry);
    }

    function updateBank(address addr, uint256 credit, bool provide1, uint256 funding, bool provide2) private {
        Table table = openTable(bankTable);
        Condition cond = table.newCondition();
        cond.EQ("addrStr", toString(addr));
        Entry entry = table.newEntry();
        bank = getBank(addr);
        entry.set("addr", bank.addr);
        entry.set("addrStr", toString(bank.addr));
        entry.set("name", bank.name);
        if(provide1) {
            entry.set("credit", bank.credit + credit);
        } else {
            require(bank.credit >= credit, "no enough credit");
            entry.set("credit", bank.credit - credit);
        }
        if(provide2) {
            entry.set("funding", bank.funding + funding);
        } else {
            require(bank.funding >= funding, "no enough funding");
            entry.set("funding", bank.funding - funding);
        }
        table.update("1", entry, cond);
    }

    // BillTable
    function getAllBills() public view returns (Bill[]) {
        Table table = openTable(billTable);
        Bill[] allBills;
        Entries entries = table.select("1", table.newCondition());
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            bill.billID = entry.getUInt("billID");
            bill.from = entry.getAddress("from");
            bill.to = entry.getAddress("to");
            bill.amount = entry.getUInt("amount");
            bill.createdDate = entry.getString("createdDate");
            bill.endDate = entry.getString("endDate");
            bill.message = entry.getString("message");
            bill.lock = entry.getUInt("lock");
            bill.billState = entry.getUInt("billState");
            bill.billType = entry.getUInt("billType");
            allBills.push(bill);
        }
        return allBills; 
    }

    function insertBill(address from, address to, uint256 amount, string createdDate, string endDate, string message, uint256 billType) private {
        Table table = openTable(billTable);
        Entries entries = table.select("1", table.newCondition());
        Entry entry = table.newEntry();
        entry.set("billID", uint256(entries.size()));
        entry.set("from", from);
        entry.set("fromStr", toString(from));
        entry.set("to", to);
        entry.set("toStr", toString(to));
        entry.set("amount", amount);
        entry.set("createdDate", createdDate);
        entry.set("endDate", endDate);
        entry.set("message", message);
        entry.set("lock", billUnlocked);
        entry.set("billState", billStateUnpaid);
        entry.set("billType", billType);
        table.insert("1", entry);
    }

    function getBillByID(uint256 billID) public view returns (Bill) {
        Table table = openTable(billTable);  
        Condition cond = table.newCondition();
        cond.EQ("billID", int256(billID));
        Entries entries = table.select("1", cond);    
        Entry entry = entries.get(0);
        bill.billID = entry.getUInt("billID");
        bill.from = entry.getAddress("from");
        bill.to = entry.getAddress("to");
        bill.amount = entry.getUInt("amount");
        bill.createdDate = entry.getString("createdDate");
        bill.endDate = entry.getString("endDate");
        bill.message = entry.getString("message");
        bill.lock = entry.getUInt("lock");
        bill.billState = entry.getUInt("billState");
        bill.billType = entry.getUInt("billType");
        return bill;
    }
    
    function updateBill(uint256 billID, uint256 lockState, uint256 billState) private {
        Table table = openTable(billTable);
        bill = getBillByID(billID);
        Condition cond = table.newCondition();
        cond.EQ("billID", int256(billID));  
        Entry entry = table.newEntry();
        entry.set("billID", bill.billID);
        entry.set("from", bill.from);
        entry.set("fromStr", toString(bill.from));
        entry.set("to", bill.to);
        entry.set("toStr", toString(bill.to));
        entry.set("amount", bill.amount);
        entry.set("createdDate", bill.createdDate);
        entry.set("endDate", bill.endDate);
        entry.set("message", bill.message);
        entry.set("lock", lockState);
        entry.set("billState", billState);
        entry.set("billType", bill.billType);
        table.update("1", entry, cond);
    }

    function getBillTo(address to) public view returns(Bill[]) {
        Table table = openTable(billTable);  
        Condition cond = table.newCondition();
        cond.EQ("toStr", toString(to));
        Bill[] allBills;
        Entries entries = table.select("1", cond);
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            bill.billID = entry.getUInt("billID");
            bill.from = entry.getAddress("from");
            bill.to = entry.getAddress("to");
            bill.amount = entry.getUInt("amount");
            bill.createdDate = entry.getString("createdDate");
            bill.endDate = entry.getString("endDate");
            bill.message = entry.getString("message");
            bill.lock = entry.getUInt("lock");
            bill.billState = entry.getUInt("billState");
            bill.billType = entry.getUInt("billType");
            allBills.push(bill);
        }
        return allBills; 
    }

    function getBillFrom(address from) public view returns(Bill[]) {
        Table table = openTable(billTable);  
        Condition cond = table.newCondition();
        cond.EQ("fromStr", toString(from));
        Bill[] allBills;
        Entries entries = table.select("1", cond);
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            bill.billID = entry.getUInt("billID");
            bill.from = entry.getAddress("from");
            bill.to = entry.getAddress("to");
            bill.amount = entry.getUInt("amount");
            bill.createdDate = entry.getString("createdDate");
            bill.endDate = entry.getString("endDate");
            bill.message = entry.getString("message");
            bill.lock = entry.getUInt("lock");
            bill.billState = entry.getUInt("billState");
            bill.billType = entry.getUInt("billType");
            allBills.push(bill);
        }
        return allBills; 
    }

    // TransactionTable
    function getAllTx() public view returns (Transaction[]) {
        Table table = openTable(txTable);
        Transaction[] allTx;
        Entries entries = table.select("1", table.newCondition());
        uint256 size = uint256(entries.size());
        Entry entry;
        for(uint256 i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            transaction.txID = entry.getUInt("txID");
            transaction.from = entry.getAddress("from");
            transaction.to = entry.getAddress("to");
            transaction.amount = entry.getUInt("amount");
            transaction.message = entry.getString("message");
            transaction.txType = entry.getUInt("txType");
            transaction.txState = entry.getUInt("txState");
            transaction.billID = entry.getUInt("billID");
            allTx.push(transaction);
        }
        return allTx; 
    }

    function insertTx(address from, address to, uint256 amount, string message, uint256 txType, uint256 txState, uint256 billID) private {
        Table table = openTable(txTable);
        Entries entries = table.select("1", table.newCondition());
        Entry entry = table.newEntry();
        entry.set("txID", uint256(entries.size()));
        entry.set("from", from);
        entry.set("fromStr", toString(from));
        entry.set("to", to);
        entry.set("toStr", toString(to));
        entry.set("amount", amount);
        entry.set("message", message);
        entry.set("txType", txType);
        entry.set("txState", txState);
        entry.set("billID", billID);
        table.insert("1", entry);
    }
    // 获取自己相关的交易
    function getMyTx(address addr) public view returns (Transaction[]) {
        Table table = openTable(txTable);
        Transaction[] allTx;
        Condition cond = table.newCondition();
        cond.EQ("fromStr", toString(addr));
        Entries entries = table.select("1", cond);
        uint256 size = uint256(entries.size());
        Entry entry;
        uint256 i;
        for(i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            transaction.txID = entry.getUInt("txID");
            transaction.from = entry.getAddress("from");
            transaction.to = entry.getAddress("to");
            transaction.amount = entry.getUInt("amount");
            transaction.message = entry.getString("message");
            transaction.txType = entry.getUInt("txType");
            transaction.txState = entry.getUInt("txState");
            transaction.billID = entry.getUInt("billID");
            allTx.push(transaction);
        }
        cond = table.newCondition();
        cond.EQ("toStr", toString(addr));
        entries = table.select("1", cond);
        size = uint256(entries.size());
        for(i = 0; i < size; i++) {
            entry = entries.get(int256(i));
            transaction.txID = entry.getUInt("txID");
            transaction.from = entry.getAddress("from");
            transaction.to = entry.getAddress("to");
            transaction.amount = entry.getUInt("amount");
            transaction.message = entry.getString("message");
            transaction.txType = entry.getUInt("txType");
            transaction.txState = entry.getUInt("txState");
            transaction.billID = entry.getUInt("billID");
            allTx.push(transaction);
        }
        return allTx;        
    }

    function getTxByID(uint256 txID) public view returns (Transaction) {
        Table table = openTable(txTable);  
        Condition cond = table.newCondition();
        cond.EQ("txID", int256(txID));
        Entries entries = table.select("1", cond);    
        Entry entry = entries.get(0);
        transaction.txID = entry.getUInt("txID");
        transaction.from = entry.getAddress("from");
        transaction.to = entry.getAddress("to");
        transaction.amount = entry.getUInt("amount");
        transaction.message = entry.getString("message");
        transaction.txType = entry.getUInt("txType");
        transaction.txState = entry.getUInt("txState");
        transaction.billID = entry.getUInt("billID");
        return transaction;
    }

    function updateTx(Transaction transactionUpdate, uint256 newState, uint256 billID) private {  
        Table table = openTable(txTable);  
        Condition cond = table.newCondition();
        cond.EQ("txID", int256(transactionUpdate.txID));  
        Entry entry = table.newEntry();
        entry.set("txID",transactionUpdate.txID);
        entry.set("from",transactionUpdate.from);
        entry.set("to",transactionUpdate.to);
        entry.set("amount",transactionUpdate.amount);
        entry.set("message",transactionUpdate.message);
        entry.set("txType",transactionUpdate.txType);
        entry.set("txState",newState);
        entry.set("txState",newState);
        entry.set("billID", billID);
        table.update("1", entry, cond);
    }


    // 注册接口
    function registration(address operatorAddr, address addr, string role, string name, uint256 companyType) public  {
        string memory operatorRole = getRole(operatorAddr);
        if(equal(role, "bank")) {
            require(equal(operatorRole, "admin"), "registration: this address is not admin");     
            insertBank(addr, name);
        } else if (equal(role, "company")) {
            require(
                equal(operatorRole, "admin") || equal(operatorRole, "bank"),
                "registration: this address is not admin or bank"
            );
            insertCompany(addr, name, companyType);
        } else {
            require(false, "unexpected role type");
        }
        insertRole(addr, role);
        emit Registration(operatorAddr, addr, role);
    }

    // 更改信用点接口
    function provideCredit(address operatorAddr, address addr, uint256 amount) public {
        string memory operatorRole = getRole(operatorAddr);
        string memory targetRole = getRole(addr);
        if(equal(targetRole, "bank")) {
            require(equal(operatorRole, "admin"), "provideCredit: this address is not admin");
            systemAdmin.creditProvided += amount;
            updateBank(addr, amount, true, 0, false);
        } else if (equal(targetRole, "company")) {
            require(
                equal(operatorRole, "admin") || equal(operatorRole, "bank"),
                "provideCredit: this address is not admin or bank"
            );
            if (equal(operatorRole, "admin")) {
                systemAdmin.creditProvided += amount;
            } else {
                updateBank(operatorAddr, amount, false, 0, false);
            }
            updateCompany(addr, amount,true, 0, false);
        }
        emit ProvideCredit(operatorAddr, addr, amount);
    }

    // 回收信用点接口
    function withdrawCredit(address operatorAddr, address addr, uint256 amount) public {
        string memory operatorRole = getRole(operatorAddr);
        string memory targetRole = getRole(addr);
        if(equal(targetRole, "bank")) {
            require(equal(operatorRole, "admin"), "withdrawCredit: this address is not admin");
            systemAdmin.creditProvided -= amount;
            updateBank(addr, amount, false, 0, false);
        } else if (equal(targetRole, "company")) {
            require(
                equal(operatorRole, "admin") || equal(operatorRole, "bank"),
                "withdrawCredit: this address is not admin or bank"
            );
            if (equal(operatorRole, "admin")) {
                systemAdmin.creditProvided -= amount;
            } else {
                updateBank(operatorAddr, amount, true, 0, false);
            }
            updateCompany(addr, amount, false, 0, false);
        }
        emit WithdrawCredit(operatorAddr, addr, amount);
    }

    // 资金发放接口
    function provideFunding(address operatorAddr, address addr, uint256 amount) public {
        require(systemAdmin.addr == operatorAddr, "provideFunding: this address is not admin");
        string memory targetRole = getRole(addr);
        if(equal(targetRole, "bank")) {
            updateBank(addr, 0, false, amount, true);
        } else {
            updateCompany(addr, 0, false, amount, true);
        }
        emit ProvideFunding(operatorAddr, addr, amount);
    }

    // 融资
    function financing(address operatorAddr, address bankAddr, uint256 amount, string message, bool useBill, uint256 billID) public {
        company = getCompany(operatorAddr);
        string memory targetRole = getRole(bankAddr);
        require(equal(targetRole, "bank"), "financing: target sholud be a bank");
        if(!useBill) {
            require(company.credit >= amount, "financing: no enough credit");
            // 扣留信用值，产生未确认交易
            updateCompany(operatorAddr, amount, false, 0, false);
            insertTx(operatorAddr, bankAddr, amount, message, txTypeCreditFinacing, txStatePending, 0);
        } else {
            bill = getBillByID(billID);
            // 非核心企业为付款的账单不能用作融资
            require(bill.billType == billTypeCore, "financing: this bill is not from a core company");
            require(bill.lock == billUnlocked, "financing: this bill has been locked");
            require(bill.billState == billStateUnpaid, "financing: this bill has been paid");
            updateBill(billID, billLocked, billStateUnpaid);
            insertTx(operatorAddr, bankAddr, bill.amount, message, txTypeBillFinacing, txStatePending, billID);
        }
        emit Financing(operatorAddr, bankAddr, useBill, message);
    }

    // 融资确认
    function confirmFinancing(address bankAddr, uint256 txID, bool accepted, string createdDate, string endDate) public {
        transaction = getTxByID(txID);
        bank = getBank(bankAddr);
        require(transaction.txState == txStatePending, "ConfirmFinancing: transaction has been confirmed");
        require(bankAddr == transaction.to, "ConfirmFinancing: cannot confirm other's finacing");
        if(transaction.txType == txTypeCreditFinacing){
            if(accepted) {
                require(bank.funding >= transaction.amount, "ConfirmFinancing: no enough funding");
                updateBank(transaction.to, 0, false, transaction.amount, false);
                updateCompany(transaction.from, 0, false, transaction.amount, true);
                updateTx(transaction, txStateAccepted, transaction.billID);
                insertBill(transaction.from, transaction.to, transaction.amount, createdDate, endDate, transaction.message, billTypeCore);
            } else {
                // 归还锁定的信用点
                updateCompany(transaction.from, transaction.amount, true, 0, false);
                updateTx(transaction, txStateRefused, transaction.billID);
            }
        } else if(transaction.txType == txTypeBillFinacing) {
            // TODO: 账单融资
            if(accepted) {
                require(bank.funding >= transaction.amount, "ConfirmFinancing: no enough funding");
                bill = getBillByID(transaction.billID);
                updateBank(transaction.to, 0, false, transaction.amount, false);
                updateCompany(transaction.from, 0, false, transaction.amount, true);
                updateTx(transaction, txStateAccepted, transaction.billID);
                emit TransferBill(bankAddr, bill.from, transaction.to, transaction.billID);
                // 结束申请贷款的账单，并新建账单
                updateBill(transaction.billID, billLocked, billStatePaid);
                insertBill(bill.from, transaction.to, transaction.amount, createdDate, endDate, transaction.message, billTypeCore);
            } else {
                // 解锁申请的账单
                updateBill(transaction.billID, billUnlocked, billStateUnpaid);
                updateTx(transaction, txStateRefused, transaction.billID);
            }
        } else {
            require(false, "ConfirmFinancing: error transaction type");
        }
        emit ConfirmFinancing(bankAddr, txID, accepted);
    }

    // 还款或者还融资
    function repay(address operatorAddr, uint256 billID) public {
        company = getCompany(operatorAddr);
        bill = getBillByID(billID);
        require(operatorAddr == bill.from, "repay: cannot repay other's bill");
        require(bill.billState == billStateUnpaid, "repay: bill has been repaied");
        require(company.funding >= bill.amount, "repay: no enough funding");
        string memory toRole = getRole(bill.to);
        if(equal(toRole, "bank")) {
            // 还融资(只有核心银行才会还融资，普通银行使用账单融资不需要还)
            updateCompany(operatorAddr, bill.amount, true, bill.amount, false);
            updateBank(bill.to, 0, false, bill.amount, true);
        } else {
            // 核心企业恢复信用值，普通企业不需要
            if(company.companyType == companyTypeNormal) {
                updateCompany(operatorAddr, 0, false, bill.amount, false);
            } else {
                updateCompany(operatorAddr, bill.amount, true, bill.amount, false);
            }
            updateCompany(bill.to, 0, false, bill.amount, true);
        }
        insertTx(operatorAddr, bill.to, bill.amount, "还账", txTypeRepayment, txStateAccepted, bill.billID);
        updateBill(billID, billLocked, billStatePaid);
        emit Repay(operatorAddr, bill.to, bill.amount);
    }

    // 账单转移
    function transferBill(address operatorAddr, address to, uint256 amount, string message, uint billID, string createdDate, string endDate) public {
        bill = getBillByID(billID);
        require(bill.billState == billStateUnpaid, "transferBill: this bill has been paid");
        require(bill.lock == billUnlocked, "transferBill: this bill has been locked");
        require(bill.to == operatorAddr, "transferBill: cannot operator other's bill");
        require(bill.amount >= amount, "transferBillL: no enough amount");
        insertTx(operatorAddr, to, amount, message, txTypeNormal, txStateAccepted, billID);
        updateBill(billID, billLocked, billStatePaid);
        insertBill(bill.from, operatorAddr, bill.amount - amount, createdDate, endDate, "transfer bill", bill.billType);
        insertBill(bill.from, to, amount, createdDate, endDate, "transfer bill", bill.billType);
        emit TransferBill(operatorAddr, operatorAddr, to, billID);
    }

    // 赊账，签发应收账单
    function transferFunding(address operatorAddr, address addr, uint256 amount, string message, string createdDate, string endDate) public {
        company = getCompany(operatorAddr);
        if(company.companyType == companyTypeCore) {
            require(company.addr == operatorAddr, "transferFunding: this addr is another company");
            require(company.credit >= amount, "transferFunding: no enough credit");
            updateCompany(operatorAddr, amount, false, 0, false);
            insertTx(operatorAddr, addr, amount, message, txTypeCreditFinacing, txStateAccepted, 0);
            insertBill(operatorAddr, addr, amount, createdDate, endDate, message, billTypeCore);
        } else {
            insertTx(operatorAddr, addr, amount, message, txTypeNormal, txStateAccepted, 0);
            insertBill(operatorAddr, addr, amount, createdDate, endDate, message, billTypeNormal);
        }
        emit TransferFunding(operatorAddr, addr, amount);
    }

}
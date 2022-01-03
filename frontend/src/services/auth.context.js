import React, { useContext, useState } from "react";
import axios from "axios";

const API = axios.create({
  withCredentials: true,
  baseURL: "http://114.115.131.113/api/",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "http://114.115.131.113",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": " GET, POST, PATCH, PUT, DELETE, OPTIONS",
  },
});

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentAddr, setCurrentAddr] = useState({
    addr: "",
    msg: "",
    role: "",
  });

  const [currentInfo, setCurrentInfo] = useState({
    Addr: "",
    Name: "",
    CompanyType: 0,
    Credit: 0,
    Funding: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [normalCompanies, setNormalCompanies] = useState(initCompanies);
  const [coreCompanies, setCoreCompanies] = useState(initCompanies);
  const [banks, setBanks] = useState(initBanks);

  const [txns, setTxns] = useState(initTxns);
  const [myTxns, setMyTxns] = useState(initTxns);

  const [bills, setBills] = useState(initBills);
  const [fromBills, setFromBills] = useState(initBills);
  const [toBills, setToBills] = useState(initBills);

  async function login(addr) {
    await API.post("/account/login", {
      addr,
    })
      .then((response) => {
        if (response.status === 200) {
          setCurrentAddr({ addr: addr, ...response.data });
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("登陆失败，请使用正确的地址");
        throw err;
      });
  }

  function logout() {
    setCurrentAddr({ addr: "", msg: "", role: "" });
  }

  async function register(addr, role, name, companyType) {
    await API.post("/account/register", {
      addr,
      role,
      name,
      companyType,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("注册失败：账户已存在");
        throw err;
      });
  }

  async function getCoreCompany() {
    await API.get("/info/company/core")
      .then((response) => {
        if (response.status === 200) {
          setNormalCompanies(response.data.company);
          setSuccess(response.data.msg);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getNormalCompany() {
    await API.get("/info/company/normal")
      .then((response) => {
        if (response.status === 200) {
          setCoreCompanies(response.data.company);
          setSuccess(response.data.msg);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getBanks() {
    await API.get("/info/bank")
      .then((response) => {
        if (response.status === 200) {
          setBanks(response.data.bank);
          setSuccess(response.data.msg);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getTransactions() {
    await API.get("/info/tx")
      .then((response) => {
        if (response.status === 200) {
          setTxns(response.data.transaction);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getMyTransactions() {
    await API.get("/info/mytx")
      .then((response) => {
        if (response.status === 200) {
          setMyTxns(response.data.transaction);
          setSuccess(response.data.msg);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getBills() {
    await API.get("/info/bill")
      .then((response) => {
        if (response.status === 200) {
          setBills(response.data.bill);
          setSuccess(response.data.msg);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getMyFromBills() {
    await API.get("/info/bill/from")
      .then((response) => {
        if (response.status === 200) {
          setFromBills(response.data.bill);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getMyToBills() {
    await API.get("/info/bill/to")
      .then((response) => {
        if (response.status === 200) {
          setToBills(response.data.bill);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function getMyinfo() {
    await API.get("/info")
      .then((response) => {
        if (response.status === 200) {
          setCurrentInfo(response.data.info);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  async function provideCredit(addr, amount) {
    await API.post("/transaction/provide/credit", {
      addr,
      amount,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("发放信用点失败：" + err.message);
      });
  }

  async function provideFunding(addr, amount) {
    await API.post("/transaction/provide/funding", {
      addr,
      amount,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("发放资金失败" + err.message);
      });
  }

  async function withdrawCredit(addr, amount) {
    await API.post("/transaction/withdraw/credit", {
      addr,
      amount,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("回收失败：" + err.message);
      });
  }

  async function repay(billID) {
    await API.post("/transaction/repay", {
      billID,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("还款失败：当前剩余金额不够");
      });
  }

  async function confirmFunding(txID, accepted) {
    await API.post("/transaction/financing/confirm", {
      txID,
      accepted,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("融资失败：当前银行金额不足或账单已被处理");
      });
  }

  async function applyFinancial(bankAddr, amount, message, billID) {
    await API.post("/transaction/financing", {
      bankAddr,
      amount,
      message,
      billID,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("申请融资失败");
      });
  }

  async function transferBill(to, amount, message, billID) {
    await API.post("/transaction/transfer/bill", {
      to,
      amount,
      message,
      billID,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("转让账单失败");
      });
  }

  async function applyBills(to, amount, message) {
    await API.post("/transaction/transfer/bill", {
      to,
      amount,
      message,
    })
      .then((response) => {
        if (response.status === 200) {
          setSuccess(response.data.msg);
          refreshState();
        }
      })
      .catch((err) => {
        setError("转让账单失败");
      });
  }

  function clearError() {
    setError("");
  }

  function clearSuccess() {
    setSuccess("");
  }

  async function refreshState() {
    await getMyinfo();
    await getCoreCompany();
    await getNormalCompany();
    await getBanks();
    await getBills();
    await getMyToBills();
    await getMyFromBills();
    await getTransactions();
    await getMyTransactions();
  }

  const value = {
    txns,
    currentInfo,
    myTxns,
    bills,
    fromBills,
    toBills,
    currentAddr,
    normalCompanies,
    coreCompanies,
    banks,
    error,
    success,
    clearError,
    clearSuccess,
    refreshState,
    login,
    logout,
    getMyinfo,
    register,
    repay,
    getCoreCompany,
    getNormalCompany,
    getBanks,
    getBills,
    applyBills,
    transferBill,
    getMyToBills,
    getMyFromBills,
    getTransactions,
    getMyTransactions,
    provideCredit,
    withdrawCredit,
    provideFunding,
    confirmFunding,
    applyFinancial,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* {!loading && children} */}
    </AuthContext.Provider>
  );
}

function createCompany(id, Addr, Name, CompanyType, Credit, Funding) {
  return { id, Addr, Name, CompanyType, Credit, Funding };
}

function createBank(id, Addr, Name, Credit, Funding) {
  return { id, Addr, Name, Credit, Funding };
}

const initCompanies = [
  createCompany(
    0,
    "0x39460f9d8764bfb811bd40563e10ee224dbe588b",
    "核心企业1",
    1,
    0,
    0
  ),
  createCompany(
    1,
    "0x39460f9d8764bfb811bd40563e10ee224dbe588b",
    "核心企业1",
    1,
    0,
    0
  ),
];

const initBanks = [
  createBank(0, "0x808f4a69b4095f01a890abc4566d7919949d150e", "银行1", 0, 0),
];

const initTxns = [
  {
    TxID: 1,
    From: "0xa62e44ed39588503f0f75865be0bd5a0ca5c84e6",
    To: "0xaddd74aab673b308bdcc07c61554a7b2a27ae28c",
    Amount: 400,
    Message: "普通企业1 转让账单给 普通企业2",
    TxType: 0,
    TxState: 2,
    BillID: 0,
  },
];

const initBills = [
  {
    BillID: 0,
    From: "",
    To: "",
    Amount: 0,
    CreatedDate: "",
    EndDate: "",
    Message: "",
    Lock: 0,
    BillState: 0,
    BillType: 0,
  },
];

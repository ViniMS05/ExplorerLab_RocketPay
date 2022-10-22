import "./css/index.css"
import IMask from "imask"

const ccBgColorOne = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
)
const ccBgColorTwo = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
)

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    paile: ["#32378e", "#33a457"],
    default: ["black", "gray"],
  }

  ccBgColorOne.setAttribute("fill", colors[type][0])
  ccBgColorTwo.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const year = String(new Date().getFullYear()).slice(2)
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",

  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: year,
      to: Number(year) + 10,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d{0,1}|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /^7\d{0,15}/,
      cardtype: "paile",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )

    return foundMask
  },
}
const cardNumberMascked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

function updateValue(value, newValue, text) {
  value.innerText = newValue.value.length === 0 ? text : newValue.value
}

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  updateValue(ccHolder, cardHolder, "Fulano da Silva")
})

cardNumberMascked.on("accept", () => {
  const ccNumber = document.querySelector(".cc-info .cc-number")
  const cardType = cardNumberMascked.masked.currentMask.cardtype
  setCardType(cardType)

  updateValue(ccNumber, cardNumberMascked, "XXXX XXXX XXXX XXXX")
})

expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  updateValue(ccExpiration, expirationDateMasked, "XX/XX")
})

securityCodeMasked.on("accept", () => {
  const ccSecurityCode = document.querySelector(".cc-security .value")
  updateValue(ccSecurityCode, securityCodeMasked, "XXX")
})

const intervalInMilliseconds = 500

const intervalId = setInterval(() => {
  console.log("interval code here")
}, intervalInMilliseconds)

// to clear:
clearInterval(intervalId)

import React, { useState, useEffect, useRef } from 'react'
import { Clock, Mail, X } from 'lucide-react'

export default function OtpVerification({ email = "user@example.com", onVerify, onResend, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [timer, setTimer] = useState(120)
  const inputRefs = useRef([])

  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value !== "" && index < 4) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const otpString = otp.join("")
    console.log('OTP submitted:', otpString)
    if (onVerify) {
      onVerify(otpString)
    }
  }

  const handleResend = () => {
    setTimer(120)
    if (onResend) {
      onResend()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="relative bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-3">
              <Mail className="text-gray-700 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">OTP Verification</h2>
          <p className="text-center mt-2 text-sm opacity-90">
            We've sent a code to {email}
          </p>
        </div>
        
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 bg-white"
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg text-lg font-semibold hover:from-gray-800 hover:to-gray-950 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Verify OTP
            </button>
          </form>
          <div className="text-center mt-6">
            {timer > 0 ? (
              <p className="text-sm text-gray-600 flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                Resend OTP in {Math.floor(timer / 60).toString().padStart(2, "0")}:
                {(timer % 60).toString().padStart(2, "0")}
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-gray-600 hover:text-gray-800 focus:outline-none text-sm font-medium transition duration-200"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import SignInLogo from "@/public/login6.svg";
import Link from "next/link";
import { normalReturn } from "@/utils/types";
import { baseURL } from "@/utils/url";

async function userSignIn(data: {}) {
  const response = await fetch(`${baseURL}/user/signin`, {
    cache: "no-cache",
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const returnData = await response.json();
  return returnData;
}

const SignIn = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [passwordOrText, setPasswordOrText] =
    React.useState<string>("password");

  const changePasswordVisibility = () => {
    if (passwordOrText === "password") {
      setPasswordOrText("text");
    } else {
      setPasswordOrText("password");
    }
  };

  const easyLogin = async () => {
    setEmail("superadmin@gmail.com");
    setPassword("superadmin");
    const data: normalReturn = await userSignIn({
      email: "superadmin@gmail.com",
      password: "superadmin",
    });
    if (data.success) {
      localStorage.setItem("token", data.results);
      location.href = "/";
    } else {
      setError(data.message);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      localStorage.removeItem("token");
    }
  });

  const handleSignIn = async () => {
    if (email !== "" && password !== "") {
      const data: normalReturn = await userSignIn({
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("token", data.results);
        location.href = "/";
      } else {
        setError(data.message);
      }
    } else {
      setError("Please fill all required fields");
    }
  };
  return (
    <section className="bg-slate-50 h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="row-auto columns-2 max-sm:columns-1 max-md:columns-1 mt-5 tracking-wide">
          <div className="flex flex-col">
            <span className="font-semibold text-3xl mb-2">Sign In</span>
            <span className="text-slate-500 mt-1 text-sm">
              sign in to your account
            </span>
            <div className="my-4">
              <button
                type="button"
                onClick={easyLogin}
                className="flex w-3/4 max-sm:w-full max-md:w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                One click login
              </button>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-slate-400"
              >
                Enter Your Email Address
              </label>
              <div className="relative mt-2 rounded-md shadow-sm w-3/4 max-sm:w-full max-md:w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="text-slate-400"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.78146 5.00058C3.25677 5.30864 1.95033 6.56683 1.59652 8.06789C1.45352 8.67439 1.45446 23.3286 1.59752 23.9374C1.7734 24.6859 2.08658 25.2203 2.71471 25.8436C3.34996 26.4741 3.79702 26.7336 4.60352 26.9398C5.07058 27.0593 5.36015 27.0624 16.0315 27.0624C26.7238 27.0624 26.9915 27.0595 27.4621 26.9391C28.5871 26.6514 29.6094 25.8373 30.1103 24.8303C30.5916 23.8629 30.5688 24.3281 30.5491 15.8436L30.5315 8.28114L30.3386 7.74252C29.89 6.48958 28.9992 5.59614 27.7399 5.13608L27.2815 4.96864L16.1565 4.95933C10.0377 4.95427 4.91896 4.97283 4.78146 5.00058ZM4.89483 6.99058C4.43833 7.14889 4.0974 7.39127 3.84765 7.7352C3.41033 8.33733 3.4339 7.83795 3.45233 16.1252L3.46896 23.5936L3.61315 23.8834C3.84615 24.3517 4.15652 24.6642 4.6109 24.8879L5.02883 25.0936H15.9989H26.969L27.3156 24.9311C27.5062 24.8416 27.7619 24.681 27.8838 24.5739C28.1999 24.2963 28.4831 23.7287 28.5621 23.2142C28.607 22.9219 28.623 20.4557 28.6113 15.6249L28.594 8.46864L28.4285 8.11564C28.2177 7.66614 27.834 7.28239 27.3845 7.07164L27.0315 6.90614L16.1252 6.8922C5.76927 6.87895 5.20258 6.88389 4.89483 6.99058ZM5.88827 9.91664C5.63208 10.0429 5.45877 10.2588 5.36652 10.5667C5.30383 10.7759 5.31315 10.8398 5.44471 11.1051C5.58383 11.3857 5.93465 11.659 10.6171 15.1342C13.4866 17.264 15.7173 18.8777 15.8202 18.8983C15.9192 18.9181 16.0811 18.9181 16.1801 18.8983C16.3254 18.8692 25.457 12.2075 26.2851 11.5263C26.5733 11.2893 26.7148 10.895 26.6276 10.5714C26.5156 10.1553 26.0492 9.81239 25.5953 9.81239C25.3536 9.81239 25.713 9.55739 20.0147 13.7717C17.8398 15.3801 16.0199 16.6871 15.9704 16.6761C15.9208 16.6651 14.1313 15.3624 11.9937 13.7811C6.12602 9.44064 6.65415 9.81214 6.35371 9.81383C6.21083 9.81458 6.0014 9.86089 5.88827 9.91664Z"
                      fill="#475569"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="block w-full rounded-md border-0 py-3 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="my-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-slate-400"
              >
                Enter Your Password
              </label>
              <div className="relative mt-2 rounded-md shadow-sm w-3/4 max-sm:w-full max-md:w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 18 22"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.08725 0.0433851C6.74049 0.21161 5.39354 0.970573 4.53155 2.04682C4.12541 2.55393 3.6658 3.46177 3.49441 4.09533C3.37304 4.54411 3.37002 4.58749 3.3525 6.14044L3.33458 7.72705L2.86186 7.75379C1.56617 7.82719 0.547234 8.58551 0.143153 9.77721L0.0175688 10.1476L0.00454746 14.7097C-0.00696101 18.7405 5.39202e-05 19.3141 0.064749 19.6346C0.249985 20.5521 0.8255 21.2937 1.66819 21.7007C2.31197 22.0116 2.03384 21.9999 8.79794 21.9999C15.562 21.9999 15.2839 22.0116 15.9277 21.7007C16.7704 21.2937 17.3459 20.5521 17.5311 19.6346C17.5958 19.3141 17.6028 18.7405 17.5913 14.7097L17.5783 10.1476L17.4715 9.82664C17.0615 8.59523 16.0464 7.82811 14.7281 7.75346L14.2541 7.72664V6.31816C14.2541 4.76594 14.2195 4.43669 13.9831 3.73944C13.1395 1.25118 10.6935 -0.282153 8.08725 0.0433851ZM8.14828 1.50276C6.85232 1.74013 5.78244 2.53582 5.21715 3.68268C4.83123 4.46557 4.8 4.65095 4.77465 6.30762L4.75273 7.74044H8.79276H12.8328V6.58153C12.8328 5.94411 12.8117 5.24774 12.7859 5.03407C12.5872 3.38625 11.4442 2.04655 9.8525 1.59588C9.46813 1.48703 8.51761 1.43508 8.14828 1.50276ZM2.57754 9.25122C2.31018 9.31568 1.94668 9.55617 1.77039 9.78533C1.44485 10.2084 1.4587 9.96786 1.47245 14.9652L1.48478 19.4552L1.59703 19.6833C1.74013 19.9742 2.02041 20.2545 2.31129 20.3976L2.53935 20.5098H8.79794H15.0565L15.2846 20.3976C15.5755 20.2545 15.8557 19.9742 15.9988 19.6833L16.1111 19.4552V14.8702V10.2851L15.9988 10.0571C15.8558 9.76648 15.5784 9.489 15.2858 9.34411L15.0565 9.23058L8.88964 9.22338C5.49785 9.21944 2.65741 9.23196 2.57754 9.25122ZM8.43113 12.4574C8.03618 12.5873 7.70073 12.8726 7.50807 13.2425C7.35328 13.5397 7.35342 14.138 7.50839 14.4346C7.56768 14.5481 7.65346 14.6822 7.69908 14.7326C7.77254 14.8139 7.78368 14.9367 7.79707 15.8101C7.81064 16.6973 7.82132 16.8115 7.90385 16.9516C8.08505 17.2592 8.19028 17.3003 8.79794 17.3003C9.40559 17.3003 9.51082 17.2592 9.69202 16.9516C9.77455 16.8115 9.78524 16.6973 9.79881 15.8101C9.81219 14.9367 9.82334 14.8139 9.89679 14.7326C9.94241 14.6822 10.0282 14.5481 10.0875 14.4346C10.2425 14.138 10.2426 13.5397 10.0878 13.2425C9.82975 12.7471 9.39303 12.458 8.86671 12.4342C8.69019 12.4262 8.49418 12.4366 8.43113 12.4574Z"
                      fill="#475569"
                    />
                  </svg>
                </div>
                <input
                  type={passwordOrText}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="block w-full rounded-md border-0 py-3 pl-10 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label htmlFor="password-toggle" className="sr-only">
                    Password Toggle
                  </label>
                  <div
                    className="pr-4 cursor-pointer"
                    onClick={changePasswordVisibility}
                  >
                    {passwordOrText === "password" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M22.5176 5.10276C22.3677 5.18261 21.9629 5.70121 20.8958 7.18069C20.1137 8.26506 19.4558 9.18285 19.4339 9.22028C19.4045 9.27027 19.243 9.24332 18.8228 9.11836C17.4288 8.70398 15.739 8.56222 14.4103 8.74823C12.0291 9.08167 9.28123 10.2492 6.41093 12.1471C4.54973 13.3778 2.40009 15.0842 2.10843 15.5625C1.97688 15.7782 1.96272 16.172 2.07863 16.3921C2.31084 16.8333 4.30852 18.4441 6.12432 19.6545C7.12219 20.3196 8.38729 21.0591 9.39502 21.5662C9.83456 21.7875 10.1942 21.9828 10.1942 22.0004C10.1942 22.0179 9.64305 22.7972 8.96934 23.7321C7.48693 25.7893 7.50051 25.7675 7.50028 26.0824C7.49983 26.6088 7.81441 26.9534 8.33501 26.9966C8.66496 27.0239 8.99175 26.8864 9.16825 26.646C9.21875 26.5772 11.4257 23.5158 14.0727 19.8429C16.7196 16.17 19.9917 11.6301 21.3441 9.75418C22.7888 7.75036 23.8253 6.25981 23.8573 6.14058C23.9661 5.73365 23.7591 5.27931 23.3744 5.08035C23.1511 4.9649 22.7572 4.97516 22.5176 5.10276ZM15.1812 10.5353C12.8818 10.7379 10.2039 11.8569 7.19997 13.8704C6.35911 14.434 4.98292 15.4551 4.60528 15.7956L4.37599 16.0023L4.60528 16.2082C5.3484 16.8752 7.09926 18.1079 8.44587 18.9122C9.19565 19.36 11.2203 20.4175 11.3231 20.415C11.3485 20.4144 11.7122 19.9369 12.1313 19.3539L12.8933 18.294L12.7505 18.1068C12.5467 17.8396 12.2774 17.239 12.167 16.8055C12.0415 16.3131 12.0809 15.3808 12.2492 14.855C12.6493 13.6053 13.802 12.612 15.118 12.3829C15.555 12.3067 16.3547 12.349 16.7452 12.4688L17.0194 12.5529L17.237 12.257C17.3567 12.0942 17.6272 11.7221 17.8381 11.4298L18.2214 10.8986L18.0656 10.8393C17.5957 10.6607 15.8485 10.4765 15.1812 10.5353ZM21.9166 10.807C21.6182 10.991 21.4646 11.2576 21.4646 11.5918C21.4646 12.0857 21.6181 12.2419 22.7288 12.8782C23.8601 13.5264 26.1032 15.0902 26.9026 15.7881C27.1013 15.9616 27.1208 15.9993 27.0536 16.0804C26.8826 16.2863 25.1776 17.5508 24.1808 18.2108C21.495 19.9894 19.2562 20.9923 17.1302 21.3694C16.6095 21.4617 16.3491 21.4672 14.3971 21.4266C14 21.4184 13.8189 21.5132 13.5906 21.8486C13.3498 22.2024 13.457 22.7572 13.8244 23.0577C14.0365 23.2313 14.3711 23.2867 15.4105 23.3202C16.5881 23.3582 17.348 23.2722 18.5464 22.965C20.5427 22.4534 23.0014 21.271 25.356 19.6907C27.1356 18.4961 29.2131 16.8148 29.4317 16.3921C29.5447 16.1737 29.5315 15.7773 29.4042 15.5686C29.1923 15.2211 27.7202 13.9961 26.2445 12.9393C25.41 12.3417 24.1147 11.5097 23.2064 10.9879C22.5957 10.6369 22.2671 10.5909 21.9166 10.807ZM15.3192 14.2487C14.9571 14.3365 14.6795 14.5049 14.4162 14.7964C14.1579 15.0822 14.065 15.2664 13.9826 15.6553C13.9195 15.9535 13.9445 16.401 14.0334 16.5676C14.0615 16.6201 14.3585 16.2525 14.9435 15.4408C15.421 14.7783 15.8118 14.2208 15.8118 14.202C15.8118 14.1528 15.6519 14.1678 15.3192 14.2487Z"
                          fill="#475569"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.6857 8.07892C11.8697 8.48426 8.77267 9.90478 5.3082 12.38C3.84437 13.4259 2.24843 14.7656 2.08128 15.0888C1.97291 15.2984 1.97291 15.6867 2.08128 15.8963C2.19545 16.117 2.73471 16.6092 3.75505 17.424C7.7405 20.6064 11.64 22.5361 14.8893 22.9338C17.8855 23.3005 21.4793 22.1413 25.4992 19.5115C27.3508 18.3002 29.7209 16.4254 30.0193 15.936C30.1621 15.702 30.1621 15.2831 30.0193 15.0491C29.8148 14.7138 28.4022 13.5279 26.9644 12.4845C23.5293 9.9917 20.1677 8.4372 17.4389 8.0795C16.6322 7.97371 15.4181 7.97348 14.6857 8.07892ZM15.1839 9.93174C12.5223 10.2376 9.16998 11.8333 5.75979 14.4177C4.79865 15.1461 4.40655 15.4572 4.40503 15.4926C4.40286 15.5407 5.69256 16.5325 6.62451 17.1993C8.88379 18.8159 11.3929 20.1134 13.3377 20.6708C15.1027 21.1766 16.4062 21.2262 18.0914 20.8514C20.4679 20.323 23.4434 18.7825 26.3663 16.5674C27.3348 15.8335 27.7198 15.5277 27.7198 15.4926C27.7198 15.4764 27.5774 15.3509 27.4034 15.2135C23.3282 11.9976 19.8491 10.2516 16.8712 9.92787C16.2271 9.85789 15.8187 9.85883 15.1839 9.93174ZM15.1677 11.8299C14.4995 11.9985 13.9647 12.3124 13.4235 12.8533C12.5965 13.6799 12.2759 14.5035 12.3278 15.6684C12.3693 16.6021 12.6762 17.347 13.2953 18.0166C14.5777 19.4036 16.6468 19.6462 18.1923 18.5905C19.85 17.4583 20.305 15.1827 19.2179 13.4615C18.7822 12.7717 18.0596 12.2089 17.2352 11.9175C16.7473 11.745 15.6828 11.6999 15.1677 11.8299ZM15.6372 13.6774C15.0943 13.8137 14.5876 14.2413 14.3544 14.7599C14.1708 15.1681 14.1708 15.8168 14.3544 16.2252C14.5267 16.6086 14.9517 17.0355 15.325 17.2001C15.7337 17.3804 16.3896 17.384 16.7791 17.2081C17.1688 17.0322 17.6071 16.6019 17.7676 16.2377C17.9537 15.8154 17.955 15.1727 17.7706 14.7545C17.6084 14.3867 17.1792 13.9554 16.8158 13.7953C16.4947 13.6538 15.9486 13.5992 15.6372 13.6774Z"
                          fill="#475569"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between my-4 w-3/4 max-sm:w-full max-md:w-full">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 cursor-pointer text-indigo-600 border-gray-300 rounded bg-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm cursor-pointer font-semibold text-gray-900 "
                >
                  Remember me.
                </label>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-500">
                  Forgot password?
                </span>
              </div>
            </div>
            {error ? (
              <div className="my-4">
                <label
                  htmlFor="error"
                  className="block text-sm font-medium leading-6 text-red-400"
                >
                  {error}
                </label>
              </div>
            ) : null}
            <div className="my-4">
              <button
                type="button"
                onClick={handleSignIn}
                className="flex w-3/4 max-sm:w-full max-md:w-full disabled:bg-indigo-500 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
            <p className="text-sm">
              Do not have an account?{" "}
              <Link href={"/signup"}>
                <span className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-500">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
          <div className="max-sm:hidden max-md:hidden">
            <Image priority src={SignInLogo} alt="Login Logo" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;

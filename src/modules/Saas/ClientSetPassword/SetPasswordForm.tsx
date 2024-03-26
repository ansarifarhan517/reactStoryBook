import React from "react";
import Layout from "../Layouts/OnboardingLayout";
import { StyledSetPasswordWrapper } from "./StyledSetPasswordForm";
import { hybridRouteTo } from "../../../utils/hybridRouting";
import PasswordInputField from "../FormElements/PasswordInputField";
import DefaultButton from "../FormElements/DefaultButton";
import { baseURL, userAccessInfo } from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { sendGA } from "../../../utils/ga";
import EyeIcon from "./Components/EyeIcon";
import EyeSlashIcon from "./Components/EyeSlashIcon";
import { IUserAccessInfo } from "../../../utils/common.interface";
import { setDataLayer } from '../ClientOnboarding/onboardingUtils'

const description = `<span>Welcome to Mile™!</span><span>Ready to explore the new era of optimized logistics? First, create a password to activate your account.</span>`;

export interface IDropdown {
  name: string;
  key: string;
}

interface IPasswordPayload {
  password : string;
}

export interface IPasswordState {
  password: string;
  error: boolean;
  errorMessage: string;
  confirm_password: string;
  location: IDropdown | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  charNumberValid: boolean;
  charMinimumNumberValid: boolean;
  specialCharValid: boolean;
  uppercaseValid: boolean;
  lowercaseValid: boolean;
  numberValid: boolean;
  match: boolean;
}

const SetPasswordForm = () => {

  //local state for set password form
  const [values, setValues] = React.useState<IPasswordState>({
    password: "",
    error: false,
    errorMessage: "",
    confirm_password: "",
    location: null,
    showPassword: false,
    showConfirmPassword: false,
    charNumberValid: false,
    charMinimumNumberValid: false,
    specialCharValid: false,
    uppercaseValid: false,
    lowercaseValid: false,
    numberValid: false,
    match: true,
  });

  // user data for GA event
  const userData = JSON.parse(localStorage.getItem('userAccessInfo') || '')
  const clientId = userData['clientId'] || ''; 
  const username = userData['userName'] || '';

  // state update on confirm password
  const handleConfirmPasswordChange =
    (prop: keyof IPasswordState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      comparePasswordValues("confirm_password", event.target.value);
    };

  //TODO:  password max length validation
  // Check the length of the input
  // const checkPasswordLength = (password: string) => {
  //   if (password.length >= 1 && password.length <= 14) {
  //     setValues((state) => {
  //       return { ...state, charNumberValid: true };
  //     });
  //   } else {
  //     setValues((state) => {
  //       return { ...state, charNumberValid: false };
  //     });
  //   }
  // };

  // ---- validation starts here ---- 
  const checkMinimumPasswordLength = (password: string) => {
    if (password.length > 6) {
      setValues((state) => {
        return { ...state, charMinimumNumberValid: true };
      });
    } else {
      setValues((state) => {
        return { ...state, charMinimumNumberValid: false };
      });
    }
  };

  // TODO: special character validation
  // Check for special characters
  // const checkSpecialCharacters = (password: string) => {
  //   const pattern = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
  //   if (pattern.test(password)) {
  //     setValues((state) => {
  //       return { ...state, specialCharValid: true };
  //     });
  //   } else {
  //     setValues((state) => {
  //       return { ...state, specialCharValid: false };
  //     });
  //   }
  // };

  // Check for an uppercase character
  const checkUppercase = (password: string) => {
    const pattern = /[A-Z]/;
    if (pattern.test(password)) {
      setValues((state) => {
        return { ...state, uppercaseValid: true };
      });
    } else {
      setValues((state) => {
        return { ...state, uppercaseValid: false };
      });
    }
  };

  // Check for an lower character
  const checkLowercase = (password: string) => {
    const pattern = /[a-z]/;
    if (pattern.test(password)) {
      setValues((state) => {
        return { ...state, lowercaseValid: true };
      });
    } else {
      setValues((state) => {
        return { ...state, lowercaseValid: false };
      });
    }
  };

  // Check for a number
  const checkNumber = (password: string) => {
    const pattern = /[0-9]/;
    if (pattern.test(password)) {
      setValues((state) => {
        return { ...state, numberValid: true };
      });
    } else {
      setValues((state) => {
        return { ...state, numberValid: false };
      });
    }
  };
  // ---- validation ends here ---- 

  // change on password validation check
  const handlePasswordChange =
    (prop: keyof IPasswordState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      // TODO: will add if later on password validation is added
      // checkPasswordLength(event.target.value);
      // checkSpecialCharacters(event.target.value);
      checkMinimumPasswordLength(event.target.value);
      checkLowercase(event.target.value);
      checkUppercase(event.target.value);
      checkNumber(event.target.value);
      comparePasswordValues("password", event.target.value);
    };

  // compare password to check equality
  function comparePasswordValues(key, value) {
    if (key === "password") {
      if (values.confirm_password == "" || value === values.confirm_password) {
        setValues((state) => {
          return { ...state, match: true };
        });
      } else {
        setValues((state) => {
          return { ...state, match: false };
        });
      }
    } else {
      if (value === values.password) {
        setValues((state) => {
          return { ...state, match: true };
        });
      } else {
        setValues((state) => {
          return { ...state, match: false };
        });
      }
    }
  }
  
  // show password in text on click of eye icon
  const handleClickShowPassword = (password: string) => {
    let changeValue = Object.entries(values).find(
      ([key, value]: [string, any]) => {
        if (key === password) {
          return value;
        }
        return false;
      }
    );
    setValues({
      ...values,
      [password]: !changeValue,
    });
  };

  // API call to set password
  async function postPassword(url = "", data:IPasswordPayload) {
    // Default options are marked with *

    let headers = new Headers();
    if (
      userAccessInfo &&
      userAccessInfo.accessToken &&
      userAccessInfo.CLIENT_SECRET_KEY
    ) {
      headers.append("Content-Type", "text/plain");
      headers.append("Content-Length", data?.password.length.toString());
      headers.append("WWW-Authenticate", userAccessInfo.accessToken);
      headers.append("CLIENT_SECRET_KEY", userAccessInfo.CLIENT_SECRET_KEY);
    } else {
      const userLoginInfo: IUserAccessInfo = JSON.parse(
        localStorage.getItem("userAccessInfo") || "{}"
      );
      headers.append("WWW-Authenticate", userLoginInfo.accessToken);
      headers.append("CLIENT_SECRET_KEY", userLoginInfo.CLIENT_SECRET_KEY);
    }
    console.log(baseURL);
    const response = await fetch(baseURL + "/" + url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: headers,
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: data?.password, // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  // on submit action
  const handleFormSubmit = async () => {
    //check for error state || check for password mistach || check for undefined
    if (
      (values.error || !values.match) &&
      !values.password &&
      !values.confirm_password &&
      values.password !== values.confirm_password
    ) {
      return;
    }
    // GA event for submitting data
    sendGA(
      "Onboarding-Set Password",
      `Click on Set Password ` +
        `${clientId ? clientId : ""} - ${username ? username : ""}`
    );

    let formData = new FormData();
    formData.append("password", values.password);
    postPassword(
      `${
        apiMappings.saas.clientOnboarding.setPassword
      }?token=${localStorage.getItem("guid")}`,
      { password: formData.get("password") || '' }
    )
      .then(({ data }) => {
        if (data) {
          hybridRouteTo("onboarding");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // validate if already password entered
  const validatePasswordExist = () => {
    const isPasswordExist = localStorage.getItem("isPasswordExist");
    if (isPasswordExist === "true") {
      hybridRouteTo("onboarding");
    }
  };

  //useEffect start here
  React.useEffect(() => {
    // TODO: check if the local state of isPasswordExist is there then redirect to onboarding steps
    validatePasswordExist();
    setDataLayer
    // validate_data().then(data => console.log(data));
  }, []);

  return (
    <Layout
      iconUrl={'images/onboardingClient/img-password.svg'}
      title="Set Password"
      description={description}
    >
      <StyledSetPasswordWrapper>
        <div className="main__content">
          <div className="content__block setpassword__block">
            {/* <form id="passwordForm"> */}
            <div className="input__wrapper grid-item">
              <PasswordInputField
                tabindex="1"
                id="new-password"
                name="new-password"
                label={"Password"}
                placeholder={"Enter your password"}
                fullWidth
                value={values.password}
                handleChange={handlePasswordChange("password")}
                // onBlur={comparePassword("password")}
                errorMessage={values.errorMessage}
                error={!!values.error}
                sx={{ width: "100%", marginTop: "1.2rem" }}
                required={true}
                type={values.showPassword ? "text" : "password"}
              />
              <button
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showPassword")}
                onMouseDown={handleMouseDownPassword}
              >
                {values.showPassword ? (
                  <EyeIcon color={"#000"} />
                ) : (
                  <EyeSlashIcon color={"#979797"} />
                )}
              </button>
              <ul className="validation__list">
                <li className={values?.uppercaseValid ? "active" : ""}>
                  1 Uppercase Letter
                </li>
                <li className={values?.lowercaseValid ? "active" : ""}>
                  1 Lowercase Letter
                </li>
                <li className={values?.numberValid ? "active" : ""}>
                  1 Number
                </li>
                <li className={values?.charMinimumNumberValid ? "active" : ""}>
                  Minimum 6 Characters
                </li>
              </ul>
            </div>

            <div className="input__wrapper grid-item">
              <PasswordInputField
                tabindex="2"
                id="confirm-password"
                name="confirm-password"
                label={"Confirm Password"}
                placeholder={"Confirm your password"}
                fullWidth
                value={values.confirm_password}
                handleChange={handleConfirmPasswordChange("confirm_password")}
                // onBlur={comparePassword("confirm_password")}
                errorMessage={values.match ? "" : "Passwords do not match."}
                error={values.match ? false : true}
                sx={{ width: "100%", marginTop: "1.2rem" }}
                required={true}
                type={values.showConfirmPassword ? "text" : "password"}
              />
              <button
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("showConfirmPassword")}
                onMouseDown={handleMouseDownPassword}
              >
                {values.showConfirmPassword ? (
                  <EyeIcon color={"#000"} />
                ) : (
                  <EyeSlashIcon color={"#979797"} />
                )}
              </button>
            </div>
            <DefaultButton
              id="set_password"
              style={{
                textTransform: "inherit",
                fontSize: "18px",
                margin: "2rem 0px 1rem 0",
              }}
              disabled={
                values.error ||
                !values.match ||
                // !values.charNumberValid ||
                !values.numberValid ||
                !values.charMinimumNumberValid ||
                // !values.specialCharValid ||
                !values.uppercaseValid ||
                !values.lowercaseValid ||
                !values.confirm_password
              }
              onHandleClick={() => {
                handleFormSubmit();
              }}
            >
              Set Password
            </DefaultButton>
            {/* </form> */}
            <span className="disclaimer__text">
              By activating your account, you agree to our{" "}
              <a
                href="https://www.loginextsolutions.com/terms-and-conditions"
                target="_blank"
                onClick={() => {
                  sendGA(
                    "Onboarding-Set Password",
                    `Click on T&C ` +
                      `${clientId ? clientId : ""} - ${
                        username ? username : ""
                      }`
                  );
                }}
              >
                Terms and Conditions
              </a>
              and{" "}
              <a
                href="https://www.loginextsolutions.com/privacy-policy"
                target="_blank"
              >
                {" "}
                Privacy Policy
              </a>
              .
            </span>
            <div className="partners_img">
              <img src={'images/onboardingClient/logo-gdpr.svg'} />
              <img src={'images/onboardingClient/logo-iso.svg'} />
              <img src={'images/onboardingClient/logo-aicpa.svg'} />
            </div>
          </div>
        </div>
      </StyledSetPasswordWrapper>
    </Layout>
  );
};

export default SetPasswordForm;

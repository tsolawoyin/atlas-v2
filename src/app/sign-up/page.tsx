"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import Logo from "@/components/logo";

import Link from "next/link";
import { useState, useContext, useTransition, useEffect } from "react";

import { usePasswordInput } from "@omergulcicek/password-input"

import { ShellContext } from "@/shell/shell";

import pDebounce from "p-debounce";

import { Spinner } from "@/components/ui/spinner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("");
  const [usernameIsAvailable, setUsernameIsAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});

  const { auth: { signUp }, supabase_tables_fn } = useContext(ShellContext);

  const { InputWrapper, wrapperProps, inputProps, value, setValue } = usePasswordInput({
    password: {
      icons: {
        show: <span className="text-xs">Show</span>,
        hide: <span className="text-xs">Hide</span>,
      }
    },
    classNames: {
      suffix: "my-custom-suffix",
      button: "bg-muted hover:bg-accent"
    }
  });

  // Sanitize and validate full name
  const sanitizeFullName = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z\s'-]/g, '');
  };

  const validateFullName = (name: string): string | null => {
    const sanitized = sanitizeFullName(name);
    if (sanitized.length < 2) return "Full name must be at least 2 characters";
    if (sanitized.length > 50) return "Full name must be less than 50 characters";
    if (!/^[a-zA-Z]/.test(sanitized)) return "Full name must start with a letter";
    return null;
  };

  // Sanitize and validate username
  const sanitizeUsername = (username: string): string => {
    return username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  };

  const validateUsername = (username: string): string | null => {
    const sanitized = sanitizeUsername(username);
    if (sanitized.length < 3) return "Username must be at least 3 characters";
    if (sanitized.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-z]/.test(sanitized)) return "Username must start with a letter";
    if (!/^[a-z0-9_-]+$/.test(sanitized)) return "Username can only contain letters, numbers, hyphens, and underscores";
    return null;
  };

  // Validate email
  const validateEmail = (email: string): string | null => {
    const trimmed = email.trim();
    if (!trimmed) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
    if (trimmed.length > 254) return "Email is too long";
    return null;
  };

  // Validate password
  const validatePassword = (password: string): string | null => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 128) return "Password is too long";
    // if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    // if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    // if (!/[0-9]/.test(password)) return "Password must contain a number";
    return null;
  };

  // Debounced username availability check
  const checkUsernameAvailability = pDebounce(async (username: string) => {
    if (!username || validateUsername(username)) {
      setUsernameIsAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const sanitized = sanitizeUsername(username);
      const isAvailable = await supabase_tables_fn.profiles.isUsernameAvailable(sanitized);
      setUsernameIsAvailable(isAvailable);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameIsAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  }, 500);

  // Check username availability when it changes
  useEffect(() => {
    if (username.length >= 3) {
      checkUsernameAvailability(username);
    } else {
      setUsernameIsAvailable(null);
    }
  }, [username]);

  const onChangeFn = (value: string, setter: Function) => setter(value);

  const validateAllInputs = (): boolean => {
    const errors: typeof validationErrors = {};

    const fullNameError = validateFullName(fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const usernameError = validateUsername(username);
    if (usernameError) errors.username = usernameError;
    else if (usernameIsAvailable === false) errors.username = "Username is already taken";

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(value);
    if (passwordError) errors.password = passwordError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const signUpHelper = async () => {
    setError(null);

    // Validate all inputs
    if (!validateAllInputs()) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    // Check username availability one final time
    if (usernameIsAvailable !== true) {
      setError("Please wait for username availability check or choose a different username");
      return;
    }

    const credentials = {
      email: email.trim(),
      password: value,
      options: {
        data: {
          username: sanitizeUsername(username),
          fullName: sanitizeFullName(fullName)
        }
      }
    };

    startTransition(async () => {
      try {
        await signUp(credentials); // nice and easy....
      } catch (error: any) {
        setError(error.message || "An error occurred during signup");
      }
    });
  };

  const isFormValid =
    fullName.trim() &&
    email.trim() &&
    username.trim() &&
    value &&
    !validationErrors.fullName &&
    !validationErrors.username &&
    !validationErrors.email &&
    !validationErrors.password &&
    usernameIsAvailable === true;

  return (
    <Card>
      <CardHeader className="flex justify-center">
        <Logo />
      </CardHeader>
      <CardContent>
        <div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(event) => {
                  onChangeFn(event.target.value, setFullName);
                  setValidationErrors(prev => ({ ...prev, fullName: undefined }));
                }}
                onBlur={() => {
                  const error = validateFullName(fullName);
                  if (error) setValidationErrors(prev => ({ ...prev, fullName: error }));
                }}
                required
              />
              {validationErrors.fullName && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.fullName}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(event) => {
                    const val = event.target.value;
                    onChangeFn(val, setUsername);
                    setValidationErrors(prev => ({ ...prev, username: undefined }));
                  }}
                  onBlur={() => {
                    const error = validateUsername(username);
                    if (error) setValidationErrors(prev => ({ ...prev, username: error }));
                  }}
                  required
                />
                {checkingUsername && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Spinner className="h-4 w-4" />
                  </div>
                )}
                {!checkingUsername && usernameIsAvailable === true && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {!checkingUsername && usernameIsAvailable === false && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
              {validationErrors.username && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.username}</p>
              )}
              {!validationErrors.username && usernameIsAvailable === false && (
                <p className="text-sm text-red-500 mt-1">Username is already taken</p>
              )}
              {!validationErrors.username && usernameIsAvailable === true && (
                <p className="text-sm text-green-500 mt-1">Username is available</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(event) => {
                  onChangeFn(event.target.value, setEmail);
                  setValidationErrors(prev => ({ ...prev, email: undefined }));
                }}
                onBlur={() => {
                  const error = validateEmail(email);
                  if (error) setValidationErrors(prev => ({ ...prev, email: error }));
                }}
                required
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputWrapper {...wrapperProps}>
                <Input
                  id="password"
                  type="password"
                  value={value}
                  onBlur={() => {
                    const error = validatePassword(value);
                    setValidationErrors(prev => ({ ...prev, password: error || undefined }));
                  }}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setValue(newValue);
                    // Clear error immediately if password becomes valid
                    const error = validatePassword(newValue);
                    setValidationErrors(prev => ({ ...prev, password: error || undefined }));
                  }}
                  required
                  {...inputProps}
                />
              </InputWrapper>
              {validationErrors.password && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
              )}

            </Field>

            <FieldGroup>
              <Field>
                <Button
                  onClick={signUpHelper}
                  className="w-full flex items-center gap-2"
                  disabled={!isFormValid || isPending}
                >
                  {isPending && <Spinner />}
                  Create Account
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login" className="text-amber-500">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>

          {error && (
            <div className="grid w-full max-w-xl items-start gap-4 mt-4">
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
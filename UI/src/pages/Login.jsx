import * as React from "react";
import "./Login.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Key, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Card className="w-[350px]" style={{ marginTop: "10px" }}>
      <CardHeader>
        <CardTitle style={{ fontSize: "30px", margin: "0 auto" }}>
          Login
        </CardTitle>
        <CardDescription style={{ margin: "0 auto" }}>
          Don't have an account?
          <Button
            variant="link"
            style={{ fontSize: "12px", padding: "5px" }}
            onClick={() => {
              navigate("/register");
            }}
          >
            Register here!
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4 auth-form">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">
                <Mail size={12} />
                Email
              </Label>
              <Input
                id="email"
                placeholder="enter your email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">
                <Key size={12} />
                Password
              </Label>
              <Input
                id="password"
                placeholder="enter your password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
          </div>
        </form>
        <div className="flex flex-col items-center mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              window.location.href = "/api/auth/google";
            }}
            style={{ width: "100%" }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            Login with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-5">
        <Button
          variant="outline"
          onClick={() => {
            setEmail("");
            setPassword("");
          }}
        >
          Clear
        </Button>
        <Button type="submit">Login</Button>
      </CardFooter>
    </Card>
  );
}
export default Login;

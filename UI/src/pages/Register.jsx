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
import { Key, Mail, Text, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUsername] = useState("");
  return (
    <Card className="w-[350px]" style={{ marginTop: "10px" }}>
      <CardHeader>
        <CardTitle style={{ fontSize: "30px", margin: "0 auto" }}>
          Register
        </CardTitle>
        <CardDescription style={{ margin: "0 auto" }}>
          Already have an account?
          <Button
            variant="link"
            style={{ fontSize: "12px", padding: "5px" }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login here!
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4 auth-form">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fullname">
                <Text size={12} />
                Full Name
              </Label>
              <Input
                id="fullname"
                placeholder="enter your full name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">
                <User size={12} />
                username
              </Label>
              <Input
                id="username"
                placeholder="enter your username"
                type="text"
                value={userName}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </div>
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
      </CardContent>
      <CardFooter className="flex justify-between mt-5">
        <Button
          style={{
            margin: "0 auto",
            fontSize: "15px",
          }}
          type="submit"
        >
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}
export default Register;

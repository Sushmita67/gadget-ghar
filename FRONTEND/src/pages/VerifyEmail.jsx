import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import API_BASE_URL from "../config/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_BASE_URL}/user/verify-email?token=${token}`)
        .then((res) => {
          setStatus(res.data.message);
          toast.success(res.data.message);
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch((err) => {
          setStatus(err.response?.data?.message || "Verification failed");
          toast.error(err.response?.data?.message || "Verification failed");
        });
    } else {
      setStatus("No verification token found.");
      toast.error("No verification token found.");
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p>{status}</p>
    </div>
  );
} 
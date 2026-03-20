import { useState } from "react";
import { Link } from "react-router-dom";

type SignupForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage = () => {
  const [form, setForm] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const onChange =
    (key: keyof SignupForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setError(null);
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim()) return setError("이메일을 입력해주세요.");
    if (form.password.length < 8)
      return setError("비밀번호는 8자 이상이어야 합니다.");
    if (form.password !== form.confirmPassword)
      return setError("비밀번호가 서로 일치하지 않습니다.");

    // TODO: API 연동 (회원가입 요청)
    // 예: await signup(form.email, form.password)
    alert("회원가입 요청(임시) 완료! API 연결 전 단계입니다.");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dex Tax Viewer 계정을 만들어 주세요.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={form.password}
              onChange={onChange("password")}
              placeholder="8자 이상"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              placeholder="비밀번호 다시 입력"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            회원가입
          </button>

          <div className="text-sm text-gray-600 mt-2">
            이미 계정이 있나요?{" "}
            <Link to="/" className="text-black font-medium underline">
              홈으로
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

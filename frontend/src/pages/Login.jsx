function Login() {
  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form className="card p-4 shadow">
        <input className="form-control mb-3" type="email" placeholder="Email" />
        <input className="form-control mb-3" type="password" placeholder="Password" />
        <button className="btn btn-dark w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
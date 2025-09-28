const Terms = () => {
  return (
    <div className="text-center">
      <p className="text-gray-500 text-sm">
        By joining, you agree to our{' '}
        <button className="text-blue-400 hover:text-blue-300 underline transition-colors">
          Terms of Service
        </button>{' '}
        and{' '}
        <button className="text-blue-400 hover:text-blue-300 underline transition-colors">
          Privacy Policy
        </button>
      </p>
    </div>
  );
};

export default Terms;

const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} YourCompany. All Rights Reserved.
          </p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a href="/about" className="hover:text-gray-400">About Us</a>
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
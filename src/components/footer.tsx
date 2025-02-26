const Footer = () => {
    return (
        <footer className="flex fixed bottom-0 items-center justify-between w-[80%] h-16 ">
            <p className="text-[20px]">
                Made with <span className="text-700">♥</span> by Stellar
            </p>
            <div className="flex items-center gap-2 mx-2">
                <button className="bg-black text-white px-3 py-1 rounded shadow-md">
                    Beta
                </button>
                <p className="text-[16px]">V1.0.0</p>
            </div>
        </footer>
    );
};

export default Footer;

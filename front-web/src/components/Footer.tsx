export default function Footer() {
    return (
        <footer className="border-t border-gray-200 p-4 text-sm text-gray-600 text-center">
            <p>ICP备案号：苏ICP备2024062761</p>
            <p>&copy; {new Date().getFullYear()}
                <a className="hover:text-blue-600" href="https://github.com/HolmesAmzish/SDDMES"> SDDMES</a>
            </p>
        </footer>
    );
}

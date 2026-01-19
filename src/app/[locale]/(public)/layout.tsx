import Footer from "@/components/shared/footer/Footer";
import Header from "@/components/shared/header/Header";


export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}

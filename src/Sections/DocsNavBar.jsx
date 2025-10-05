import { useEffect, useState } from "react";
import { docsNavTexts } from "../Constants/index";
import { scrollToSection } from '../Utils/ScrollToSection';


export const DocsNavigation = () => {
    const [activeSection, setActiveSection] = useState('endpoints');

    // Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
        const sections = ['endpoints', 'examples', 'token-info', 'guidelines'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element && scrollPosition >= element.offsetTop) {
            setActiveSection(section);
            }
        }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:scale-95">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-cyan-800/30 shadow-2xl p-2">
            <nav className="flex space-x-1">
            {docsNavTexts.map((item) => (
                <button
                key={item.id}
                onClick={() => scrollToSection({sectionId:item.id,setActiveSection:setActiveSection})}
                className={`cursor-pointer flex flex-col items-center p-3 rounded-lg transition-all min-w-[70px] ${
                    activeSection === item.id
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg'
                    : 'text-cyan-200 hover:bg-gray-800 hover:text-cyan-300'
                }`}
                >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                </button>
            ))}
            </nav>
        </div>
        </div>
    )
};
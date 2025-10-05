export const scrollToSection = ({sectionId,setActiveSection,canLowerCase=false}) => {
    var section=sectionId;
    if (canLowerCase){
        section=sectionId.toLowerCase()
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
};
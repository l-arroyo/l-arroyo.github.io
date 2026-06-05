window.scrollToSection = (id) => {

    const el = document.getElementById(id);

    if (!el) return;

    el.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};

window.scrollToTop = () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};
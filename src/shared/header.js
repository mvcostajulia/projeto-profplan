const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = "/img/logo.png"; 
document.head.appendChild(favicon);

const criarHeader = (funcao) => {
    const header = document.createElement('header');
    let usuariosMenu = ` `;
    if(funcao==='Administrador'){
        usuariosMenu= `<li><a href="/usuarios">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM6.75 12C6.75 9.10051 9.10051 6.75 12 6.75C14.8995 6.75 17.25 9.10051 17.25 12C17.25 14.8995 14.8995 17.25 12 17.25C9.10051 17.25 6.75 14.8995 6.75 12Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.78838 1.99562C8.99437 1.92912 9.21904 1.95487 9.40465 2.06623L11.597 3.38163C11.8657 3.36962 12.1348 3.36963 12.4036 3.38165L14.5868 2.07516C14.7709 1.965 14.9933 1.93894 15.1978 2.00357C16.6306 2.45621 17.9478 3.21483 19.0583 4.22689C19.2175 4.37197 19.3067 4.57849 19.303 4.79385L19.2601 7.3422C19.4082 7.56954 19.544 
                        7.8046 19.6671 8.04638L21.8895 9.28198C22.0766 9.38602 22.2103 9.56508 22.257 9.77405C22.584 11.2385 22.5874 12.7567 22.2671 14.2226C22.2211 14.4333 22.0865 14.6141 21.8978 14.7186L19.6668 15.9542C19.5438 16.1958 19.4081 16.4306 19.2601 16.6578L19.303 19.2061C19.3067 19.4215 19.2175 19.628 19.0583 19.7731C17.9501 20.7829 16.6385 21.5438 15.2117 22.0043C15.0057 22.0708 14.781 22.0451 14.5954 21.9337L12.4031 20.6183C12.1343 20.6303 11.8652 20.6303 11.5965 20.6183L9.41328 21.9248C9.2292 22.035 9.00676 22.061 8.80221 21.9964C7.36949 21.5437 6.05226 20.7851 4.94172 19.7731C4.78251 19.628 4.69337 19.4214 4.69701 19.2061L4.73996 16.6635C4.59279 16.4338 4.45708 16.1969 4.33335 15.9538L2.11058 14.718C1.92345 14.6139 1.78971 14.4349 1.74305 14.2259C1.41608 12.7615 1.41263 11.2433 1.73294 9.77738C1.77899 9.56662 1.91356 9.3859 2.10228 9.28138L4.33326 8.04576C4.45625 7.8042 4.59199 7.56935 4.73991 7.3422L4.69701 4.79385C4.69338 4.57848 4.78253 4.37195 4.94174 4.22687C6.04995 3.21702 7.36157 2.45621 8.78838 1.99562ZM6.20264 5.1156L6.24367 7.55298C6.24633 7.71088 6.19907 7.8656 6.10864 7.99507C5.90747 8.28308 5.73135 8.58779 5.58221 8.90587C5.51517 9.04887 5.40469 9.16705 5.26653 9.24357L3.13328 10.4251C2.94669 11.4668 2.94928 12.5337 3.14094 13.5746L5.2676 14.757C5.40471 14.8332 5.51447 14.9505 5.58142 15.0924C5.73384 15.4154 5.9116 15.7258 6.11306 16.0207C6.20066 16.1489 6.24629 16.3011 6.24367 16.4564L6.20266 18.8843C7.01332 19.5691 7.94034 20.1029 8.93958 20.4602L11.0243 19.2127C11.1563 19.1337 11.3094 19.0972 11.4629 19.1081C11.8205 19.1337 12.1795 19.1337 12.5371 19.1081C12.6909 19.0971 12.8443 19.1338 12.9765 19.2131L15.0679 20.468C16.0639 20.105 16.988 19.5688 17.7974 18.8844L17.7564 16.447C17.7537 16.2891 17.801 16.1344 17.8914 16.0049C18.0926 15.7169 18.2687 15.4122 18.4178 15.0941C18.4849 14.9511 18.5954 14.8329 18.7335 14.7564L20.8668 13.5749C21.0534 12.5331 21.0508 11.4662 20.8591 10.4254L18.7325 9.24298C18.5948 9.16643 18.4847 9.04849 18.4178 8.90587C18.2687 8.58779 18.0926 8.28308 17.8914 7.99507C17.801 7.8656 17.7537 7.71088 17.7564 7.55298L17.7974 5.1157C16.9868 4.43088 16.0597 3.89709 15.0605 3.53976L12.9758 4.78729C12.8437 4.8663 12.6906 4.90279 12.5371 4.89182C12.1795 4.86624 11.8205 4.86624 11.4629 4.89182C11.3091 4.90282 11.1557 4.86616 11.0235 4.78685L8.93211 3.532C7.93614 3.89499 7.01209 4.43111 6.20264 5.1156Z" fill="white"/>
                    </svg>
                    Usuários</a></li>`;
    }
    header.className = 'barra-fixa';
    header.innerHTML = `
            <div class="menu-icon">
                <svg  id="list-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 16C4 15.4477 4.44772 15 5 15H27C27.5523 15 28 15.4477 28 16C28 16.5523 27.5523 17 27 17H5C4.44772 17 4 16.5523 4 16Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8C4 7.44772 4.44772 7 5 7H27C27.5523 7 28 7.44772 28 8C28 8.55228 27.5523 9 27 9H5C4.44772 9 4 8.55228 4 8Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 24C4 23.4477 4.44772 23 5 23H27C27.5523 23 28 23.4477 28 24C28 24.5523 27.5523 25 27 25H5C4.44772 25 4 24.5523 4 24Z" fill="white"/>
                </svg> 
            </div>
            <ul class="menu">
                <li id="icon"><img src="../img/logo.png"/></li>
                <li><a href="/index"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 4.5C3 3.67157 3.67157 3 4.5 3H19.5C20.3284 3 21 3.67157 21 4.5V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V4.5ZM19.5 4.5H4.5V19.5H19.5V4.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 1.5C16.9142 1.5 17.25 1.83579 17.25 2.25V5.25C17.25 5.66421 16.9142 6 16.5 6C16.0858 6 15.75 5.66421 15.75 5.25V2.25C15.75 1.83579 16.0858 1.5 16.5 1.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 1.5C7.91421 1.5 8.25 1.83579 8.25 2.25V5.25C8.25 5.66421 7.91421 6 7.5 6C7.08579 6 6.75 5.66421 6.75 5.25V2.25C6.75 1.83579 7.08579 1.5 7.5 1.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 8.25C3 7.83579 3.33579 7.5 3.75 7.5H20.25C20.6642 7.5 21 7.83579 21 8.25C21 8.66421 20.6642 9 20.25 9H3.75C3.33579 9 3 8.66421 3 8.25Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9209 11.4857C16.2049 11.7872 16.1908 12.2618 15.8893 12.5459L11.5112 16.6709C11.2216 16.9437 10.7694 16.9429 10.4807 16.6691L8.10884 14.4191C7.80832 14.1341 7.79581 13.6593 8.08088 13.3588C8.36595 13.0583 8.84066 13.0458 9.14117 13.3309L10.9986 15.0929L14.8607 11.4541C15.1622 11.1701 15.6368 11.1842 15.9209 11.4857Z" fill="white"/>
                    </svg>
                    Calendários</a></li>
                <li><a href="/turmas">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 5.25C8.00544 5.25 7.05161 5.64509 6.34835 6.34835C5.64509 7.05161 5.25 8.00544 5.25 9V20.25H18.75V9C18.75 8.00544 18.3549 7.05161 17.6517 6.34835C16.9484 5.64509 15.9946 5.25 15 5.25H9ZM9 3.75C7.60761 3.75 6.27226 4.30312 5.28769 5.28769C4.30312 6.27226 3.75 7.60761 3.75 9V20.25C3.75 20.6478 3.90804 21.0294 4.18934 21.3107C4.47065 21.592 4.85218 21.75 5.25 21.75H18.75C19.1478 21.75 19.5294 21.592 19.8107 21.3107C20.092 21.0294 20.25 20.6478 20.25 20.25V9C20.25 7.60761 19.6969 6.27226 18.7123 5.28769C17.7277 4.30312 16.3924 3.75 15 3.75H9Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 13.5C8.80109 13.5 8.61032 13.579 8.46967 13.7197C8.32902 13.8603 8.25 14.0511 8.25 14.25V21C8.25 21.4142 7.91421 21.75 7.5 21.75C7.08579 21.75 6.75 21.4142 6.75 21V14.25C6.75 13.6533 6.98705 13.081 7.40901 12.659C7.83097 12.2371 8.40326 12 9 12H15C15.5967 12 16.169 12.2371 16.591 12.659C17.0129 13.081 17.25 13.6533 17.25 14.25V21C17.25 21.4142 16.9142 21.75 16.5 21.75C16.0858 21.75 15.75 21.4142 15.75 21V14.25C15.75 14.0511 15.671 13.8603 15.5303 13.7197C15.3897 13.579 15.1989 13.5 15 13.5H9Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 2.25C10.3011 2.25 10.1103 2.32902 9.96967 2.46967C9.82902 2.61032 9.75 2.80109 9.75 3V4.5C9.75 4.91421 9.41421 5.25 9 5.25C8.58579 5.25 8.25 4.91421 8.25 4.5V3C8.25 2.40326 8.48705 1.83097 8.90901 1.40901C9.33097 0.987053 9.90326 0.75 10.5 0.75H13.5C14.0967 0.75 14.669 0.987053 15.091 1.40901C15.5129 1.83097 15.75 2.40326 15.75 3V4.5C15.75 4.91421 15.4142 5.25 15 5.25C14.5858 5.25 14.25 4.91421 14.25 4.5V3C14.25 2.80109 14.171 2.61032 14.0303 2.46967C13.8897 2.32902 13.6989 2.25 13.5 2.25H10.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.75 8.25C9.75 7.83579 10.0858 7.5 10.5 7.5H13.5C13.9142 7.5 14.25 7.83579 14.25 8.25C14.25 8.66421 13.9142 9 13.5 9H10.5C10.0858 9 9.75 8.66421 9.75 8.25Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 15.75C6.75 15.3358 7.08579 15 7.5 15H16.5C16.9142 15 17.25 15.3358 17.25 15.75C17.25 16.1642 16.9142 16.5 16.5 16.5H7.5C7.08579 16.5 6.75 16.1642 6.75 15.75Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 15C13.9142 15 14.25 15.3358 14.25 15.75V17.25C14.25 17.6642 13.9142 18 13.5 18C13.0858 18 12.75 17.6642 12.75 17.25V15.75C12.75 15.3358 13.0858 15 13.5 15Z" fill="white"/>
                        </svg>                    
                    Turmas</a></li>
                <li><a href="/tecnicos">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 10.5C10.7574 10.5 9.75 11.5074 9.75 12.75C9.75 13.9926 10.7574 15 12 15C13.2426 15 14.25 13.9926 14.25 12.75C14.25 11.5074 13.2426 10.5 12 10.5ZM8.25 12.75C8.25 10.6789 9.92893 9 12 9C14.0711 9 15.75 10.6789 15.75 12.75C15.75 14.8211 14.0711 16.5 12 16.5C9.92893 16.5 8.25 14.8211 8.25 12.75Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.5C11.2432 16.5 10.4968 16.6762 9.81988 17.0147C9.14296 17.3531 8.55414 17.8445 8.10004 18.45C7.85152 18.7814 7.38141 18.8485 7.05004 18.6C6.71867 18.3515 6.65152 17.8814 6.90004 17.55C7.49386 16.7583 8.26385 16.1156 9.14906 15.673C10.0343 15.2304 11.0104 15 12 15C12.9897 15 13.9658 15.2304 14.851 15.673C15.7362 16.1156 16.5062 16.7582 17.1 17.55C17.3486 17.8814 17.2814 18.3515 16.95 18.6C16.6187 18.8485 16.1486 18.7814 15.9 18.45C15.446 17.8445 14.8571 17.3531 14.1802 17.0147C13.5033 16.6762 12.7569 16.5 12 16.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 2.25C19.5784 2.25 20.25 2.92157 20.25 3.75V20.25C20.25 21.0784 19.5784 21.75 18.75 21.75H5.25C4.42157 21.75 3.75 21.0784 3.75 20.25V3.75C3.75 2.92157 4.42157 2.25 5.25 2.25L18.75 2.25ZM18.75 20.25V3.75L5.25 3.75L5.25 20.25H18.75Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.25 6C8.25 5.58579 8.58579 5.25 9 5.25H15C15.4142 5.25 15.75 5.58579 15.75 6C15.75 6.41421 15.4142 6.75 15 6.75H9C8.58579 6.75 8.25 6.41421 8.25 6Z" fill="white"/>
                    </svg>
                    Técnicos de<br>Ensino</a></li>
                <li><a href="/cursos">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6471 2.33824C11.8676 2.22059 12.1324 2.22059 12.3529 2.33824L23.6029 8.33824C23.8473 8.46858 24 8.72302 24 9C24 9.27698 23.8473 9.53142 23.6029 9.66176L12.3529 15.6618C12.1324 15.7794 11.8676 15.7794 11.6471 15.6618L0.397059 9.66176C0.152661 9.53142 0 9.27698 0 9C0 8.72302 0.152661 8.46858 0.397059 8.33824L11.6471 2.33824ZM2.34375 9L12 14.15L21.6562 9L12 3.85L2.34375 9Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3383 8.64708C11.5332 8.2816 11.9875 8.14334 12.353 8.33826L17.978 11.3383C18.2224 11.4686 18.375 11.723 18.375 12V22.5C18.375 22.9142 18.0392 23.25 17.625 23.25C17.2108 23.25 16.875 22.9142 16.875 22.5V12.45L11.6471 9.66179C11.2816 9.46687 11.1433 9.01257 11.3383 8.64708Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37501 9.64685C3.78922 9.64685 4.12501 9.98264 4.12501 10.3969V15.5062L4.12665 15.5083L4.12661 15.5084C4.68281 16.2555 7.149 19.125 12 19.125C16.851 19.125 19.3172 16.2555 19.8734 15.5084L19.875 15.5062V10.3969C19.875 9.98264 20.2108 9.64685 20.625 9.64685C21.0392 9.64685 21.375 9.98264 21.375 10.3969V15.5156L21.375 15.5188C21.3736 15.8397 21.2681 16.1515 21.0743 16.4072C20.3702 17.3517 17.5116 20.625 12 20.625C6.48838 20.625 3.62978 17.3517 2.92574 16.4072C2.73193 16.1515 2.62637 15.8397 2.62501 15.5188L2.625 15.5156H2.62501V10.3969C2.62501 9.98264 2.96079 9.64685 3.37501 9.64685Z" fill="white"/>
                    </svg>   
                    Cursos</a></li>
                <li><a href="/agendamentos">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.68934 4.18934C2.97064 3.90804 3.35217 3.75 3.75 3.75H20.25C20.6478 3.75 21.0294 3.90804 21.3107 4.18934C21.592 4.47065 21.75 4.85218 21.75 5.25V18.75C21.75 19.1642 21.4142 19.5 21 19.5C20.5858 19.5 20.25 19.1642 20.25 18.75V5.25L3.75 5.25L3.75 18.75C3.75 19.1642 3.41421 19.5 3 19.5C2.58579 19.5 2.25 19.1642 2.25 18.75V5.25C2.25 4.85217 2.40804 4.47064 2.68934 4.18934Z" fill="white" fill-opacity="0.3"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.75 18.75C0.75 18.3358 1.08579 18 1.5 18H22.5C22.9142 18 23.25 18.3358 23.25 18.75C23.25 19.1642 22.9142 19.5 22.5 19.5H1.5C1.08579 19.5 0.75 19.1642 0.75 18.75Z" fill="white" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 15.75C10.5 15.3358 10.8358 15 11.25 15H18C18.4142 15 18.75 15.3358 18.75 15.75V18.75C18.75 19.1642 18.4142 19.5 18 19.5C17.5858 19.5 17.25 19.1642 17.25 18.75V16.5H12V18.75C12 19.1642 11.6642 19.5 11.25 19.5C10.8358 19.5 10.5 19.1642 10.5 18.75V15.75Z" fill="white" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 7.5C5.25 7.08579 5.58579 6.75 6 6.75H18C18.4142 6.75 18.75 7.08579 18.75 7.5V12.75C18.75 13.1642 18.4142 13.5 18 13.5C17.5858 13.5 17.25 13.1642 17.25 12.75V8.25H6.75V18.75C6.75 19.1642 6.41421 19.5 6 19.5C5.58579 19.5 5.25 19.1642 5.25 18.75V7.5Z" fill="white" />
                    </svg>
                    Agendamentos</a></li>
                <li><a href="/conta">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75C9.1005 3.75 6.75 6.1005 6.75 9C6.75 11.8995 9.1005 14.25 12 14.25C14.8995 14.25 17.25 11.8995 17.25 9C17.25 6.1005 14.8995 3.75 12 3.75ZM5.25 9C5.25 5.27208 8.27208 2.25 12 2.25C15.7279 2.25 18.75 5.27208 18.75 9C18.75 12.7279 15.7279 15.75 12 15.75C8.27208 15.75 5.25 12.7279 5.25 9Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.7491C10.2884 15.7491 8.60689 16.1997 7.12461 17.0556C5.64233 17.9115 4.41149 19.1425 3.55581 20.6249C3.34873 20.9837 2.89005 21.1066 2.53131 20.8995C2.17257 20.6925 2.04963 20.2338 2.2567 19.875C3.24402 18.1646 4.66423 16.7442 6.37455 15.7566C8.08488 14.7691 10.025 14.2491 12 14.2491C13.975 14.2491 15.9151 14.7691 17.6255 15.7566C19.3358 16.7442 20.756 18.1646 21.7433 19.875C21.9504 20.2338 21.8274 20.6925 21.4687 20.8995C21.11 21.1066 20.6513 20.9837 20.4442 20.6249C19.5885 19.1425 18.3577 17.9115 16.8754 17.0556C15.3931 16.1997 13.7116 15.7491 12 15.7491Z" fill="white"/>
                    </svg>
                    Conta</a></li>
                ${usuariosMenu}
                <li><form action="/api/logout" method="POST">
                    <button type="submit">                
                    <a>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75C12.4142 3.75 12.75 4.08579 12.75 4.5V11.625C12.75 12.0392 12.4142 12.375 12 12.375C11.5858 12.375 11.25 12.0392 11.25 11.625V4.5C11.25 4.08579 11.5858 3.75 12 3.75Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.12861 4.67217C8.35454 5.01934 8.25626 5.48393 7.90909 5.70987C6.554 6.59175 5.52016 7.88792 4.96167 9.40518C4.40318 10.9224 4.34994 12.5796 4.80989 14.1295C5.26983 15.6795 6.21834 17.0394 7.51403 18.0064C8.80972 18.9735 10.3832 19.4959 12 19.4959C13.6168 19.4959 15.1903 18.9735 16.486 18.0064C17.7817 17.0394 18.7302 15.6795 19.1901 14.1295C19.6501 12.5796 19.5968 10.9224 19.0383 9.40518C18.4798 7.88792 17.446 6.59175 16.0909 5.70987C15.7437 5.48393 15.6455 5.01934 15.8714 4.67217C16.0973 4.325 16.5619 4.22672 16.9091 4.45266C18.5352 5.51092 19.7758 7.06632 20.446 8.88703C21.1162 10.7077 21.1801 12.6963 20.6281 14.5563C20.0762 16.4162 18.938 18.0481 17.3832 19.2085C15.8283 20.369 13.9401 20.9959 12 20.9959C10.0599 20.9959 8.17166 20.369 6.61683 19.2085C5.06201 18.0481 3.9238 16.4162 3.37187 14.5563C2.81993 12.6963 2.88382 10.7077 3.55401 8.88703C4.2242 7.06632 5.4648 5.51092 7.09091 4.45266C7.43808 4.22672 7.90267 4.325 8.12861 4.67217Z" fill="white"/>
                    </svg>
                    Sair</a></button></form></li>
            </ul>`;
        return header;
}

const adicionarLogicaMenu = () => {
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.menu');
    menuIcon.addEventListener('click', (event) => {
        menu.classList.toggle('active'); 
        menuIcon.classList.toggle('menu-ativo'); 
    });
    document.addEventListener('click', (event) => {
        const isMenuActive = menu.classList.contains('active');
        const clickedOutside = !menu.contains(event.target) && !menuIcon.contains(event.target);
        if (isMenuActive && clickedOutside) {
            menu.classList.toggle('active'); 
            menuIcon.classList.toggle('menu-ativo'); 
        }
    });
};

async function verificaUsuario(){
    try {
        const response = await fetch('/conta/preencher', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Erro ao obter usuário');
        }
        const data = await response.json();
        const user = await encontraUsuario(data.usuario.matricula.toString());
        window.userAtual = data.usuario.matricula.toString();
        return user;
    } catch (error) {
        console.error(error);
    }
}

async function encontraUsuario(matricula) {
    const response = await fetch('/usuarios/gerenciar');
    const usuarios = await response.json();
    const mapTecnico = usuarios.filter(user => {
        return user.matricula===matricula;
    });
    return mapTecnico[0];
}

document.addEventListener('DOMContentLoaded', async () => {
    const config = window.headerConfig;
    const menu = config.menuId;
    const cor = config.cor;
    verificaUsuario().then(async user => {
        const header = criarHeader(user.funcao);
        document.body.prepend(header);
        adicionarLogicaMenu();
        const avatar= user.avatar.split("/").pop();
        adicionarNomesCor(user.nome, avatar, menu, cor);
    }).catch(error => {
        console.error('Erro ao carregar usuário:', error);
        const header = criarHeader("");
        document.body.prepend(header);
        adicionarLogicaMenu();
        adicionarNomesCor("", "" , menu, cor);
    });
});

function adicionarNomesCor(nome, avatar, menu, cor){
    const nomeUser = nome.split(" ")[0];
    const header = document.querySelector('.barra-fixa');
    header.style.backgroundColor = cor;
    const h1 = document.createElement('h1');
    h1.textContent = menu;
    const h12 = document.createElement('h1');
    h12.classList.add('bem-vindo');
    h12.textContent = `Olá, ${nomeUser}`;
    const imgIcon = document.createElement('img');
    imgIcon.classList.add('imgIcon');
    imgIcon.setAttribute('id','iconImg');
    imgIcon.setAttribute('src',`../img/avatares/${avatar}`)
    const h2 = document.createElement('h2');
    h2.textContent = "PROFPLAN";
    h2.classList.add("logo");
    header.appendChild(h1);
    header.appendChild(h12);
    header.appendChild(imgIcon);
    header.appendChild(h2);
    const menuIcon = document.querySelector('.menu-icon');
    const logo = document.querySelector('.logo');
    menuIcon.addEventListener('click', () => {
        logo.classList.toggle('logo-ativo');
        h12.classList.toggle('bv-ativo');
    });
    document.addEventListener('click', (event) => {
        const isLogoActive = logo.classList.contains('logo-ativo');
        const clickedOutsideLogo = !logo.contains(event.target) && !menuIcon.contains(event.target);
        if (isLogoActive && clickedOutsideLogo) {
            logo.classList.remove('logo-ativo');
        }
    });
}

const COURSES_CATALOG = [
        { id: 1, name: "Full Stack Web Development", duration: "6 months", fee: "$799", icon: "fab fa-js", description: "Master MERN stack, React, Node.js, and build production-ready applications." },
        { id: 2, name: "Data Science & AI", duration: "8 months", fee: "$999", icon: "fas fa-chart-line", description: "Python, Machine Learning, Deep Learning, Tableau, and AI fundamentals." },
        { id: 3, name: "Cybersecurity Essentials", duration: "5 months", fee: "$649", icon: "fas fa-shield-alt", description: "Network security, ethical hacking, risk management, and compliance." },
        { id: 4, name: "Cloud Computing (AWS/Azure)", duration: "4 months", fee: "$749", icon: "fab fa-aws", description: "Cloud architecture, DevOps, serverless, and certification prep." },
        { id: 5, name: "UI/UX Design Mastery", duration: "4 months", fee: "$599", icon: "fas fa-pencil-ruler", description: "Figma, prototyping, user research, and design thinking." },
        { id: 6, name: "Digital Marketing", duration: "3 months", fee: "$499", icon: "fas fa-chart-simple", description: "SEO, Google Ads, social media strategy, and analytics." }
    ];

    // Users storage
    let users = [];

    // Load from localStorage
    function loadUsersFromStorage() {
        const stored = localStorage.getItem("educore_users");
        if(stored) {
            users = JSON.parse(stored);
        } else {
            // Add demo user for testing
            users = [
                { 
                    email: "demo@educore.com", 
                    password: "demo123", 
                    fullName: "Demo Student", 
                    enrolledCourses: [] 
                }
            ];
            saveUsersToStorage();
        }
    }

    function saveUsersToStorage() {
        localStorage.setItem("educore_users", JSON.stringify(users));
    }

    let currentUser = null;

    function findUserByEmail(email) {
        return users.find(u => u.email === email);
    }

    function updateCurrentUserStorage() {
        if(currentUser) {
            const index = users.findIndex(u => u.email === currentUser.email);
            if(index !== -1) {
                users[index] = currentUser;
                saveUsersToStorage();
            }
        }
    }

    // Enroll logic
    function enrollCourse(courseId) {
        if(!currentUser) return false;
        if(currentUser.enrolledCourses.includes(courseId)) return false;
        currentUser.enrolledCourses.push(courseId);
        updateCurrentUserStorage();
        renderCoursesAndEnrolled();
        showNotification("Successfully enrolled in the course!", "success");
        return true;
    }

    function isEnrolled(courseId) {
        return currentUser && currentUser.enrolledCourses.includes(courseId);
    }

    function getEnrolledCoursesDetails() {
        return COURSES_CATALOG.filter(c => currentUser.enrolledCourses.includes(c.id));
    }

    function showNotification(message, type) {
        // Simple alert for demo, can be enhanced
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        msgDiv.style.position = 'fixed';
        msgDiv.style.bottom = '20px';
        msgDiv.style.right = '20px';
        msgDiv.style.backgroundColor = type === 'success' ? '#48bb78' : '#e53e3e';
        msgDiv.style.color = 'white';
        msgDiv.style.padding = '12px 20px';
        msgDiv.style.borderRadius = '10px';
        msgDiv.style.zIndex = '1000';
        msgDiv.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        document.body.appendChild(msgDiv);
        setTimeout(() => msgDiv.remove(), 3000);
    }

    // Render course grid and enrolled list
    function renderCoursesAndEnrolled() {
        const container = document.getElementById("coursesContainer");
        if(!container) return;
        container.innerHTML = "";
        
        COURSES_CATALOG.forEach(course => {
            const enrolledFlag = isEnrolled(course.id);
            const card = document.createElement("div");
            card.className = "course-card";
            card.innerHTML = `
                <div class="course-icon"><i class="${course.icon}"></i></div>
                <h3>${course.name}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span><i class="far fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-tag"></i> ${course.fee}</span>
                </div>
                <button class="enroll-btn ${enrolledFlag ? 'enrolled' : ''}" data-id="${course.id}" ${enrolledFlag ? 'disabled' : ''}>
                    ${enrolledFlag ? '<i class="fas fa-check"></i> Enrolled' : '<i class="fas fa-plus-circle"></i> Enroll Now'}
                </button>
            `;
            container.appendChild(card);
        });

        // Attach event listeners to enroll buttons
        document.querySelectorAll(".enroll-btn").forEach(btn => {
            if(btn.disabled) return;
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const courseId = parseInt(btn.getAttribute("data-id"));
                enrollCourse(courseId);
            });
        });

        // Render enrolled list
        const enrolledListDiv = document.getElementById("enrolledList");
        if(enrolledListDiv) {
            const enrolledCourses = getEnrolledCoursesDetails();
            if(enrolledCourses.length === 0) {
                enrolledListDiv.innerHTML = `<span style="background: white; padding: 0.6rem 1.2rem; border-radius: 2rem; color: #64748b;">
                    <i class="fas fa-info-circle"></i> No courses enrolled yet. Browse and enroll!
                </span>`;
            } else {
                enrolledListDiv.innerHTML = enrolledCourses.map(c => `
                    <span style="background: white; border-radius: 2rem; padding: 0.6rem 1.2rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        <i class="${c.icon}"></i> ${c.name}
                    </span>
                `).join('');
            }
        }
    }

    // Navigation
    function initNavbar() {
        const navBtns = document.querySelectorAll(".nav-btn");
        const panels = {
            home: document.getElementById("homePanel"),
            about: document.getElementById("aboutPanel"),
            courses: document.getElementById("coursesPanel"),
            contact: document.getElementById("contactPanel")
        };
        
        function setActivePanel(panelId) {
            Object.values(panels).forEach(p => p.classList.remove("active-panel"));
            panels[panelId].classList.add("active-panel");
            navBtns.forEach(btn => {
                const val = btn.getAttribute("data-nav");
                if(val === panelId) btn.classList.add("active");
                else btn.classList.remove("active");
            });
            if(panelId === "courses") {
                renderCoursesAndEnrolled();
            }
        }
        
        navBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const navVal = btn.getAttribute("data-nav");
                setActivePanel(navVal);
            });
        });
        
        const exploreBtn = document.getElementById("exploreCoursesBtn");
        if(exploreBtn) exploreBtn.addEventListener("click", () => setActivePanel("courses"));
        
        setActivePanel("home");
    }

    // Show dashboard after login
    function showDashboard() {
        document.getElementById("authSection").style.display = "none";
        const dashboardEl = document.getElementById("dashboard");
        dashboardEl.style.display = "block";
        document.getElementById("dashboardUserName").innerHTML = currentUser.fullName;
        
        // Reset to home panel
        const homePanel = document.getElementById("homePanel");
        const allPanels = document.querySelectorAll(".panel");
        allPanels.forEach(p => p.classList.remove("active-panel"));
        homePanel.classList.add("active-panel");
        
        const navBtns = document.querySelectorAll(".nav-btn");
        navBtns.forEach(btn => btn.classList.remove("active"));
        const homeBtn = document.querySelector(".nav-btn[data-nav='home']");
        if(homeBtn) homeBtn.classList.add("active");
        
        renderCoursesAndEnrolled();
        initNavbar();
    }

    function logout() {
        currentUser = null;
        document.getElementById("authSection").style.display = "flex";
        document.getElementById("dashboard").style.display = "none";
        
        // Clear forms
        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";
        document.getElementById("regName").value = "";
        document.getElementById("regEmail").value = "";
        document.getElementById("regPassword").value = "";
        
        // Reset error messages
        document.getElementById("loginError").innerText = "";
        document.getElementById("registerError").innerText = "";
        document.getElementById("registerSuccess").innerText = "";
        
        // Show register tab by default
        document.querySelector('[data-tab="register"]').click();
    }

    // Auth handlers
    function handleRegister() {
        const fullName = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const errorDiv = document.getElementById("registerError");
        const successDiv = document.getElementById("registerSuccess");
        
        errorDiv.innerText = "";
        successDiv.innerText = "";
        
        if(!fullName || !email || !password) {
            errorDiv.innerText = "❌ All fields are required";
            return;
        }
        if(password.length < 4) {
            errorDiv.innerText = "❌ Password must be at least 4 characters";
            return;
        }
        if(findUserByEmail(email)) {
            errorDiv.innerText = "❌ Email already registered. Please login instead.";
            return;
        }
        
        const newUser = {
            email: email,
            password: password,
            fullName: fullName,
            enrolledCourses: []
        };
        users.push(newUser);
        saveUsersToStorage();
        
        successDiv.innerText = "✅ Registration successful! Please login.";
        
        // Clear register form
        document.getElementById("regName").value = "";
        document.getElementById("regEmail").value = "";
        document.getElementById("regPassword").value = "";
        
        // Switch to login tab after 1.5 seconds
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click();
            successDiv.innerText = "";
        }, 1500);
    }

    function handleLogin() {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const errorDiv = document.getElementById("loginError");
        
        errorDiv.innerText = "";
        
        if(!email || !password) {
            errorDiv.innerText = "❌ Please enter email and password";
            return;
        }
        
        const user = findUserByEmail(email);
        if(!user || user.password !== password) {
            errorDiv.innerText = "❌ Invalid credentials. Try demo@educore.com / demo123";
            return;
        }
        
        currentUser = { ...user };
        errorDiv.innerText = "";
        showDashboard();
    }

    // Tab switching
    function setupAuthTabs() {
        const tabs = document.querySelectorAll(".auth-tab");
        const registerForm = document.getElementById("registerForm");
        const loginForm = document.getElementById("loginForm");
        
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                
                const tabName = tab.getAttribute("data-tab");
                if(tabName === "register") {
                    registerForm.classList.add("active-form");
                    loginForm.classList.remove("active-form");
                    document.getElementById("registerError").innerText = "";
                    document.getElementById("registerSuccess").innerText = "";
                } else {
                    loginForm.classList.add("active-form");
                    registerForm.classList.remove("active-form");
                    document.getElementById("loginError").innerText = "";
                }
            });
        });
    }

    // Initialize app
    function init() {
        loadUsersFromStorage();
        setupAuthTabs();
        
        document.getElementById("registerBtn").addEventListener("click", handleRegister);
        document.getElementById("loginBtn").addEventListener("click", handleLogin);
        document.getElementById("logoutBtn").addEventListener("click", logout);
        
        // Enter key support
        document.getElementById("loginPassword").addEventListener("keypress", (e) => {
            if(e.key === "Enter") handleLogin();
        });
        document.getElementById("regPassword").addEventListener("keypress", (e) => {
            if(e.key === "Enter") handleRegister();
        });
        
        // Ensure dashboard hidden initially
        document.getElementById("dashboard").style.display = "none";
        document.getElementById("authSection").style.display = "flex";
    }
    
    init();
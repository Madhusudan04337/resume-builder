import { loginWithEmail, signUpWithEmail, logoutUser, loginWithGoogle, onAuthStateChanged, auth, resetPasswordWithEmail, setAuthPersistence } from './auth.js?v=2';

const style = document.createElement('style');
style.innerHTML = `
    @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.95) translateY(-20px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .auth-modal-content {
        animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .auth-input {
        transition: all 0.2s ease;
    }
    .auth-input:focus {
        border: 1px solid #d83478 !important;
        background: #fff !important;
        box-shadow: 0 0 0 3px rgba(216,52,120,0.1) !important;
    }
    .auth-btn {
        transition: all 0.2s ease !important;
    }
    .auth-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 15px rgba(216,52,120,0.3);
    }
    .auth-btn:active {
        transform: translateY(1px);
    }
    .auth-google-btn {
        transition: all 0.2s ease !important;
    }
    .auth-google-btn:hover {
        background: #f8f9fa !important;
        border-color: #d2d2d2 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .auth-google-btn:active {
        transform: translateY(1px);
    }
    .auth-link {
        transition: color 0.2s ease;
    }
    .auth-link:hover {
        color: #d83478 !important;
    }
    @keyframes scan {
        0% { top: 0; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
    .scanner-line {
        animation: scan 2.5s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// 1. Create the Auth Modal HTML structure and inject it into the DOM
const authContainer = document.createElement('div');
authContainer.innerHTML = `
<div id="authModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div class="auth-modal-content" style="background: white; border-radius: 16px; width: 850px; max-width: 90%; display: flex; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;">
        
        <!-- Left Animated Section -->
        <div style="flex: 1; background: linear-gradient(135deg, #0f172a, #1e1b4b); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; position: relative; overflow: hidden;">
            
            <!-- Background Glows -->
            <div style="position: absolute; top: -20%; left: -20%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%); filter: blur(40px);"></div>
            <div style="position: absolute; bottom: -20%; right: -20%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%); filter: blur(40px);"></div>

            <!-- Resume Document Icon -->
            <div style="position: relative; width: 180px; height: 240px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); backdrop-filter: blur(10px); z-index: 2; display: flex; flex-direction: column;">
                
                <!-- Skeleton Text Lines -->
                <div style="width: 50%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; margin-bottom: 24px;"></div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 12px;"></div>
                <div style="width: 90%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 12px;"></div>
                <div style="width: 95%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 24px;"></div>
                
                <div style="width: 40%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; margin-bottom: 16px;"></div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 12px;"></div>
                <div style="width: 85%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-bottom: 12px;"></div>

                <!-- Animated Scanner Line -->
                <div class="scanner-line" style="position: absolute; left: 0; right: 0; height: 2px; background: #10b981; box-shadow: 0 0 15px 4px rgba(16, 185, 129, 0.5); z-index: 3;"></div>
            </div>

            <!-- Branding Text -->
            <div style="margin-top: 40px; text-align: center; z-index: 2;">
                <h3 style="color: #fff; font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px;">MDK Resume AI</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; max-width: 260px;">Authenticate to access your workspace and build ATS-proof resumes.</p>
            </div>
        </div>

        <!-- Right Form Section -->
        <div style="flex: 1; padding: 50px 40px; display: flex; flex-direction: column; justify-content: center; background: white; color: #333; position: relative;">
            <h2 id="authTitle" style="margin-top: 0; margin-bottom: 20px; font-size: 28px; text-align: center; font-weight: 800; color: #222;">LOGIN</h2>
            
            <div id="authErrorMessage" style="display: none; padding: 10px; margin-bottom: 15px; border-radius: 4px; font-size: 13px; text-align: center;"></div>

            <div style="position: relative; margin-bottom: 15px;">
                <svg style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #999;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input type="email" id="authEmail" class="auth-input" placeholder="Email" style="width: 100%; padding: 14px 14px 14px 40px; box-sizing: border-box; border: 1px solid transparent; background: #f0f0f0; border-radius: 4px; font-size: 14px; outline: none; color: #333;" />
            </div>

            <div style="position: relative; margin-bottom: 15px;">
                <svg style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #999;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="authPassword" class="auth-input" placeholder="Password" style="width: 100%; padding: 14px 14px 14px 40px; box-sizing: border-box; border: 1px solid transparent; background: #f0f0f0; border-radius: 4px; font-size: 14px; outline: none; color: #333;" />
            </div>
            
            <div id="authOptionsContainer" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <label style="font-size: 13px; color: #888; display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="authRememberMe" style="margin-right: 8px; accent-color: #d33878; width: 16px; height: 16px;" checked /> Remember me
                </label>
                <a href="#" id="authForgotPasswordLink" class="auth-link" style="font-size: 13px; color: #888; text-decoration: none;">Forgot password?</a>
            </div>
            
            <button id="authSubmitBtn" class="auth-btn" style="width: 100%; padding: 14px; background: #d83478; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 15px; font-weight: bold; margin-bottom: 20px;">LOGIN</button>
            
            <div style="text-align: center; color: #aaa; font-size: 13px; margin-bottom: 20px; position: relative;">
                <span style="background: white; padding: 0 10px; z-index: 1; position: relative;">Or login with</span>
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee; z-index: 0;"></div>
            </div>
            
            <button id="authGoogleBtn" class="auth-google-btn" style="width: 100%; padding: 12px; background: #fff; color: #555; border: 1px solid #e0e0e0; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                Google
            </button>

            <p style="font-size: 13px; text-align: center; margin: 0; color: #888;">
                <span id="authToggleText">Not a member?</span> <a href="#" id="authToggleLink" class="auth-link" style="color: #888; text-decoration: underline;">Sign up now</a>
            </p>
            
            <button id="authCloseBtn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; color: #aaa; cursor: pointer; line-height: 1;">&times;</button>
        </div>
    </div>
</div>
`;
document.body.appendChild(authContainer);

// 2. Select or Create the Login/Logout buttons for the Navigation bar
let loginBtn = document.getElementById('navLoginBtn');
let logoutBtn = document.getElementById('navLogoutBtn');

// 3. UI State variables and Element Selection
const authModal = document.getElementById('authModal');
const authToggleLink = document.getElementById('authToggleLink');
const authForgotPasswordLink = document.getElementById('authForgotPasswordLink');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authGoogleBtn = document.getElementById('authGoogleBtn');
const authTitle = document.getElementById('authTitle');
const authCloseBtn = document.getElementById('authCloseBtn');
const authErrorMessage = document.getElementById('authErrorMessage');
const authOptionsContainer = document.getElementById('authOptionsContainer');
let isLoginMode = true;

const showAuthMessage = (msg, isError = true) => {
    if (!msg) {
        authErrorMessage.style.display = "none";
        return;
    }
    authErrorMessage.style.display = "block";
    authErrorMessage.textContent = msg;
    authErrorMessage.style.backgroundColor = isError ? "#fef2f2" : "#f0fdf4";
    authErrorMessage.style.color = isError ? "#ef4444" : "#22c55e";
    authErrorMessage.style.border = isError ? "1px solid #f87171" : "1px solid #4ade80";
};

const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
            return 'Invalid email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account already exists with this email address.';
        case 'auth/weak-password':
            return 'Your password must be at least 6 characters long.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed before completion.';
        default:
            return error.message ? error.message.replace('Firebase: ', '').replace(/\\([^)]+\\)/, '').trim() : 'An unexpected error occurred.';
    }
};

// 4. Event Listeners
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthMessage(""); // clear message on open
        authModal.style.display = "flex";
    });
}

authCloseBtn.addEventListener('click', () => {
    authModal.style.display = "none";
});

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutUser();
    });
}

authToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    showAuthMessage(""); // clear message on toggle
    authTitle.textContent = isLoginMode ? "LOGIN" : "SIGN UP";
    authSubmitBtn.textContent = isLoginMode ? "LOGIN" : "SIGN UP";
    
    const authToggleText = document.getElementById('authToggleText');
    if (authToggleText) {
        authToggleText.textContent = isLoginMode ? "Not a member?" : "Already a member?";
    }
    
    authToggleLink.textContent = isLoginMode ? "Sign up now" : "Login now";
    authOptionsContainer.style.display = isLoginMode ? "flex" : "none";
});

authForgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    showAuthMessage("");
    const email = document.getElementById('authEmail').value;
    if (!email) {
        showAuthMessage("Please enter your email address in the field above first to reset your password.");
        return;
    }
    try {
        await resetPasswordWithEmail(email);
        showAuthMessage("Password reset email sent! Please check your inbox.", false);
    } catch (err) {
        showAuthMessage(getFriendlyErrorMessage(err));
    }
});

// Handle Email/Password Login & Signup
authSubmitBtn.addEventListener('click', async () => {
    showAuthMessage("");
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const rememberMe = document.getElementById('authRememberMe').checked;
    
    if(!email || !password) {
        showAuthMessage("Please enter both email and password.");
        return;
    }

    try {
        await setAuthPersistence(rememberMe);
        if (isLoginMode) {
            await loginWithEmail(email, password);
        } else {
            await signUpWithEmail(email, password);
        }
        // Success state handled by onAuthStateChanged global listener
    } catch (err) {
        showAuthMessage(getFriendlyErrorMessage(err));
    }
});

// Handle Google Login
authGoogleBtn.addEventListener('click', async () => {
    showAuthMessage("");
    const rememberMe = document.getElementById('authRememberMe').checked;
    try {
        await setAuthPersistence(rememberMe);
        await loginWithGoogle();
        // Success state handled by onAuthStateChanged global listener
    } catch (err) {
        showAuthMessage(getFriendlyErrorMessage(err));
    }
});

// 5. Global Auth State tracking
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    
    if (user) {
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) {
            logoutBtn.style.display = "inline-flex";
            logoutBtn.textContent = `Logout`;
        }
        
        // If on index page, redirect to workspace
        if (currentPath === '/' || currentPath.endsWith('index.html')) {
            window.location.href = '/workspace.html';
        }
    } else {
        if (loginBtn) loginBtn.style.display = "inline-flex";
        if (logoutBtn) logoutBtn.style.display = "none";
        
        // If on workspace page and not logged in, redirect to index page
        if (currentPath.includes('workspace')) {
            window.location.href = '/';
        }
    }
});

// 6. Intercept Launch App / Start Building buttons on index.html
const indexLaunchBtn = document.getElementById('launchBtn');
const indexHeroCTA = document.getElementById('heroCTA');

const handleLaunchClick = (e) => {
    e.preventDefault();
    // Open the login modal instead of navigating
    authModal.style.display = "flex";
};

if (indexLaunchBtn) indexLaunchBtn.addEventListener('click', handleLaunchClick);
if (indexHeroCTA) indexHeroCTA.addEventListener('click', handleLaunchClick);

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';
import {
	ClearLocalStorage,
	GetLocalStorage,
	StoreLocalStorage,
} from '../../utils/localStorage';
type AuthContextType = {
	isAuthenticated: boolean;

	isLoading: boolean;
	login: (data: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = GetLocalStorage('pt_t_ah');
		setIsAuthenticated(!!token);
		setIsLoading(false);
	}, []);

	const login = (data: string) => {
		StoreLocalStorage("pt_t_ah", data)
		setIsAuthenticated(true);
	};

	const logout = () => {
		ClearLocalStorage();
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

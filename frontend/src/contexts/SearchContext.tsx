"use client";

import * as React from "react";

interface SearchContextType {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
}

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [isExpanded, setIsExpanded] = React.useState(false);

	return (
		<SearchContext.Provider value={{ searchQuery, setSearchQuery, isExpanded, setIsExpanded }}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	const context = React.useContext(SearchContext);
	if (context === undefined) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
}


import { Input, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useMemo, useState } from "react";
import { type ILanguage, languages } from "../../configs/languages";

interface IProps {
    isOpen: boolean;
    value: string;
    onClose: () => void;
    onSelect: (language: ILanguage) => void;
}

export const LanguageSelectorModal = ({ isOpen, value, onClose, onSelect }: IProps) => {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return languages;
        return languages.filter(
            (lang) => lang.name.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query),
        );
    }, [search]);

    const handleSelect = (language: ILanguage) => {
        onSelect(language);
        setSearch("");
        onClose();
    };

    const handleClose = () => {
        setSearch("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} scrollBehavior="inside" placement="bottom">
            <ModalContent>
                <ModalHeader>Select country</ModalHeader>
                <ModalBody className="pb-4 gap-3">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onValueChange={setSearch}
                        startContent={<i className="fa-solid fa-magnifying-glass text-gray-400" />}
                        isClearable
                        onClear={() => setSearch("")}
                        autoFocus
                    />
                    <ul className="divide-y divide-gray-100">
                        {filtered.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    type="button"
                                    className={`w-full flex items-center gap-3 px-1 py-2.5 text-left transition-colors rounded-lg ${
                                        value === lang.code ? "bg-primary-50 text-primary" : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => handleSelect(lang)}
                                >
                                    <img
                                        src={`/flags/${lang.code}.png`}
                                        alt={lang.code}
                                        className="w-6 h-4 object-cover rounded-sm shrink-0"
                                    />
                                    <span className="text-sm">{lang.name}</span>
                                    {value === lang.code && (
                                        <i className="fa-solid fa-check ml-auto text-primary text-xs" />
                                    )}
                                </button>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="py-6 text-center text-sm text-gray-400">No results</li>
                        )}
                    </ul>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

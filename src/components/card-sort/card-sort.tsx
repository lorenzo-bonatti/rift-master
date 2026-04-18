import { Chip, Switch } from "@heroui/react";
import { EnumSort } from "../../types/card-page";

interface IValue {
    sort: EnumSort;
    sortDirection: "asc" | "desc";
    enableSetSort: boolean;
}

interface IProps {
    value: IValue;
    onChange: (value: IValue) => void;
}

export const CardSort = ({ value, onChange }: IProps) => {
    const { sort, sortDirection, enableSetSort: setSort } = value;

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Sort</h3>
                <div className="grid grid-cols-1 gap-1">
                    <Chip
                        variant="flat"
                        color={sort === EnumSort.NUMBER ? "primary" : "default"}
                        startContent={<i className="fa fa-hashtag" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sort: EnumSort.NUMBER })}
                    >
                        Card number
                    </Chip>
                    <Chip
                        variant="flat"
                        color={sort === EnumSort.NAME ? "primary" : "default"}
                        startContent={<i className="fa fa-a" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sort: EnumSort.NAME })}
                    >
                        Name
                    </Chip>
                    <Chip
                        variant="flat"
                        color={sort === EnumSort.ENERGY ? "primary" : "default"}
                        startContent={<i className="fa fa-circle" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sort: EnumSort.ENERGY })}
                    >
                        Energy
                    </Chip>
                    <Chip
                        variant="flat"
                        color={sort === EnumSort.POWER ? "primary" : "default"}
                        startContent={<img src="/power.png" alt="Might" className="w-4 h-4 object-contain" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sort: EnumSort.POWER })}
                    >
                        Power
                    </Chip>
                    <Chip
                        variant="flat"
                        color={sort === EnumSort.MIGHT ? "primary" : "default"}
                        startContent={<img src="/might.png" alt="Might" className="w-4 h-4 object-contain" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sort: EnumSort.MIGHT })}
                    >
                        Might
                    </Chip>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Direction</h3>
                <div className="grid grid-cols-1 gap-1">
                    <Chip
                        variant="flat"
                        color={sortDirection === "asc" ? "primary" : "default"}
                        startContent={<i className="fa fa-arrow-down-a-z" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sortDirection: "asc" })}
                    >
                        Ascending
                    </Chip>
                    <Chip
                        variant="flat"
                        color={sortDirection === "desc" ? "primary" : "default"}
                        startContent={<i className="fa fa-arrow-down-z-a" />}
                        className="max-w-full"
                        onClick={() => onChange({ ...value, sortDirection: "desc" })}
                    >
                        Descending
                    </Chip>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Card set</h3>
                <Switch
                    size="sm"
                    isSelected={setSort}
                    onValueChange={(isSelected) => onChange({ ...value, enableSetSort: isSelected })}
                >
                    Enable set sorting
                </Switch>
                <p className="text-xs">Cards will be sorted by their set order, then by the selected sort</p>
            </div>
        </div>
    );
};

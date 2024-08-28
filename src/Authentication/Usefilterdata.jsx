import { useEffect, useState } from "react";

const useFilterData = (props) => {
    const [filteredData, setFilteredData] = useState(props);
    const [searchValue, setSearchValue] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const filterByDate = (data, date) => {
        if (date && data.length > 0) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            return data.filter((item) => {
                const itemDate = new Date(item.createdat);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
        return data;
    };

    const filterBySearch = (data, value) => {
        const lowercaseValue = value.toLowerCase().trim();
        if (lowercaseValue === "" || data.length === 0) {
            return data;
        } else {
            return data.filter((item) => {
                const message = item.data?.message ? item.data.message.toLowerCase() : "";
                const firstName = item.first_name ? item.first_name.toLowerCase() : "";
                const lastName = item.last_name ? item.last_name.toLowerCase() : "";
                const fullName = `${firstName} ${lastName}`.trim();
                const ownername = item.groundid?.ownername ? item.groundid?.ownername.toLowerCase() : "";
                const groundname = item.groundname ? item.groundname.toLowerCase() : "";
                const first_Name = item.bookedby?.first_name ? item.bookedby?.first_name.toLowerCase() : "";
                const last_Name = item.bookedby?.last_name ? item.bookedby?.last_name.toLowerCase() : "";
                const name = `${first_Name} ${last_Name}`.trim();
                const Ticketname = item?.name ? item?.name.toLowerCase() : "";

                return (
                    fullName.includes(lowercaseValue) ||
                    lastName.includes(lowercaseValue) ||
                    firstName.includes(lowercaseValue) ||
                    message.includes(lowercaseValue) ||
                    ownername.includes(lowercaseValue) ||
                    groundname.includes(lowercaseValue) ||
                    name.includes(lowercaseValue) ||
                    Ticketname.includes(lowercaseValue)
                );
            });
        }
    };

    useEffect(() => {
        let filtered = props;

        if (filtered.length > 0) {
            if (selectedDate) {
                console.log("Filtering by date:", selectedDate);
                filtered = filterByDate(filtered, selectedDate);
            }
            if (searchValue) {
                console.log("Filtering by search value:", searchValue);
                filtered = filterBySearch(filtered, searchValue);
            }
        }

        console.log("Filtered data:", filtered);
        setFilteredData(filtered);
    }, [props, selectedDate, searchValue]);

    return { filteredData, searchValue, setSearchValue, selectedDate, setSelectedDate };
};

export default useFilterData;

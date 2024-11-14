const checkSchedule = async (originalItems, item) => {
    if(item && originalItems){
        // Find an item in originalItems with the same balloonSchedule and bookingDate
        const existingItem = originalItems.find(
            (originalItem) =>
                originalItem.balloonSchedule.toString() === item.balloonSchedule.toString() &&
                new Date(originalItem.bookingDate).getFullYear() === new Date(item.bookingDate).getFullYear() &&
                new Date(originalItem.bookingDate).getMonth() === new Date(item.bookingDate).getMonth() &&
                new Date(originalItem.bookingDate).getDate() === new Date(item.bookingDate).getDate()
        );

        if (existingItem) {
            // If an item with the same balloonSchedule and bookingDate exists, update adult and child counts
            existingItem.adult += item.adult;
            existingItem.child += item.child;
        } else {
            // If no matching item is found, add the new item to originalItems
            originalItems.push(item);
        }
    }
    return originalItems;
};

module.exports = checkSchedule;
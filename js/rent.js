//  ניהול תהליך השכרה של דירה אחת
/**
 * פונקציית עזר לבדיקת חפיפה בין שני טווחי תאריכים.
 * מחזירה true אם יש חפיפה, false אם אין.
 * @param {string} start1 - תאריך התחלה של הטווח הראשון (בפורמט 'YYYY-MM-DD')
 * @param {string} end1 - תאריך סיום של הטווח הראשון (בפורמט 'YYYY-MM-DD')
 * @param {string} start2 - תאריך התחלה של הטווח השני (בפורמט 'YYYY-MM-DD')
 * @param {string} end2 - תאריך סיום של הטווח השני (בפורמט 'YYYY-MM-DD')
 * @returns {boolean} - האם יש חפיפה בין הטווחים
 */
function isDateRangeOverlap(start1, end1, start2, end2) {
   const date1Start = new Date(start1);
   const date1End = new Date(end1);
   const date2Start = new Date(start2);
   const date2End = new Date(end2);

  return !(end1 < start2 || start1 > end2);
}

/**
 * בודק האם הטווח שהתבקש פנוי להשכרה בדירה מסוימת.
 * יש לממש את החלק של קריאת ההזמנות ב-localStorage והבדיקה בעזרת isDateRangeOverlap.
 * @param {string} listingId - מזהה הדירה
 * @param {string} startDate - תאריך התחלה שנבחר להשכרה
 * @param {string} endDate - תאריך סיום שנבחר להשכרה
 * @returns {boolean} - true אם הזמנים פנויים, false אם יש חפיפה
 */
function checkAvailability(listingId, startDate, endDate) {
  // TODO: לולאה על כל מפתחות ה-localStorage של המשתמשים
  // רמז - key.endsWith('_bookings')
  //      - קריאה לנתוני ההזמנות שלהם
  //      - חיפוש הזמנות עם listingId זה
  //      - שימוש ב-isDateRangeOverlap להשוואה בין טווחים
  // להחזיר false אם יש חפיפה, true אם פנוי

   for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
      if (key.endsWith('_bookings')) {
            const bookingsString = localStorage.getItem(key);
            let bookings = [];
            try { bookings = JSON.parse(bookingsString);
               if (!Array.isArray(bookings)) {
                    bookings = [];} 
              } 
            catch (e) { console.error("Error parsing bookings from localStorage for key:", key, e);
                continue; 
            } 
            for (const booking of bookings) {
                if (booking.listingId === listingId) {
                    if (isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)) {
                        return false;}
                }
            }
        }
    }
    return true;
}

            const userBookingsKey = `${currentUser.username}_bookings`;
            const userBookings = JSON.parse(localStorage.getItem(userBookingsKey)) || [];

            const newBooking = {
                listingId: listingId,
                startDate: startDate,
                endDate: endDate
            };

            userBookings.push(newBooking);
            localStorage.setItem(userBookingsKey, JSON.stringify(userBookings));
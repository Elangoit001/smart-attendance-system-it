exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);

        const records = await Attendance.find({ date: queryDate });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

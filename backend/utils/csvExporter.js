const { Parser } = require('json2csv');

exports.exportToCSV = (res, data, fileName) => {
    try {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(fileName);
        return res.send(csv);
    } catch (error) {
        console.error('CSV Export Error:', error);
        return res.status(500).json({ message: 'Error generating CSV.' });
    }
};

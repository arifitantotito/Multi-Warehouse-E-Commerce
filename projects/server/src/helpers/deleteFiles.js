const fs = require('fs')

const deleteFiles = (files) => {
    // files.images.forEach((value) => {

    // bentuk file yang dikirim harus objek dalam array
        fs.unlink(files.images[0].path, function (err) {
            try {
                if (err) throw err
            } catch (error) {
                console.log(error)
            }
        })
    // })
}

module.exports = deleteFiles
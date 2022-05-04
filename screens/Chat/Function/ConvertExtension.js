import React from "react";
export default function ConvertExtension(extension) {
    //word
    if (extension === 'doc' || extension === 'dot' ) {
        return 'msword'
    }
    else if (extension === 'docx'){
        return 'vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
    else if (extension === 'dotx'){
        return 'vnd.openxmlformats-officedocument.wordprocessingml.template'
    }
    else if (extension === 'docm'){
        return 'vnd.ms-word.document.macroEnabled.12'
    }
    else if (extension === 'dotm'){
        return 'vnd.ms-word.template.macroEnabled.12'
    }
    //excel
    else if (extension === 'xls' || extension === 'xlt' || extension === 'xla'){
        return 'vnd.ms-excel'
    }
    else if (extension === 'xlsx'){
        return 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
    else if (extension === 'xltx'){
        return 'vnd.openxmlformats-officedocument.spreadsheetml.template'
    }
    else if (extension === 'xlsm'){
        return 'vnd.ms-excel.sheet.macroEnabled.12'
    }
    else if (extension === 'xltm'){
        return 'vnd.ms-excel.template.macroEnabled.12'
    }
    else if (extension === 'xlam'){
        return 'vnd.ms-excel.addin.macroEnabled.12'
    }
    else if (extension === 'xlsb'){
        return 'vnd.ms-excel.sheet.binary.macroEnabled.12'
    }
    else if (extension === 'ppt' || extension === 'pot' || extension === 'pps' || extension === 'ppa'){
        return 'vnd.ms-powerpoint'
    }
    else if (extension === 'pptx') {
        return 'vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    else if (extension === 'potx') {
        return 'vnd.openxmlformats-officedocument.presentationml.template'
    }
    else if (extension === 'ppsx') {
        return 'vnd.openxmlformats-officedocument.presentationml.slideshow'
    }
    else if (extension === 'ppam') {
        return 'vnd.ms-powerpoint.addin.macroEnabled.12'
    }
    else if (extension === 'pptm'){
        return 'vnd.ms-powerpoint.presentation.macroEnabled.12'
    }

    else if (extension === 'potm'){
        return 'vnd.ms-powerpoint.template.macroEnabled.12'
    }
    else if (extension === 'ppsm'){
        return 'vnd.ms-powerpoint.slideshow.macroEnabled.12'
    }
    else if (extension === 'mdb'){
        return 'vnd.ms-access'
    }
    else if (extension === 'pdf'){
        return 'pdf'
    }
    return 'not_support'
}
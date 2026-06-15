// ==========================================
// Google Apps Script - نظام جرد أصول المدرسة
// ==========================================

// 1. ضع رابط ملف Google Sheets الخاص بك هنا بالكامل
const SHEET_URL = 'ضع_رابط_ملف_جوجل_شيت_هنا';
const SHEET_NAME = 'Assets';

function getSheet() {
  let ss;
  try {
    if (SHEET_URL.includes('http')) {
      ss = SpreadsheetApp.openByUrl(SHEET_URL);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch(e) {
    throw new Error("خطأ: يرجى التأكد من وضع رابط Google Sheets الصحيح في المتغير SHEET_URL");
  }
  
  if (!ss) throw new Error("لا يمكن الوصول لملف الجداول. تأكد من الرابط.");
  return ss;
}

// الدالة الأولى للتأكد من وجود الورقة وإعداد الأعمدة
function setup() {
  const ss = getSheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['ID', 'Branch', 'School', 'Room Type', 'Floor', 'Room No', 'Asset Type', 'Quantity', 'Brand', 'Model', 'Serial', 'Status', 'Date', 'Description'];
    sheet.appendRow(headers);
    sheet.getRange("A1:N1").setFontWeight("bold").setBackground("#0c54a3").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

// استقبال البيانات من الموقع وإضافتها كصف جديد
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // الانتظار لمدة تصل إلى 30 ثانية للحصول على قفل الكتابة لمنع تعارض البيانات في نفس اللحظة
    lock.waitLock(30000);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': 'خطأ: الخادم مشغول حالياً، يرجى المحاولة مرة أخرى.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const ss = getSheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.id || '',
      data.branch || '',
      data.school || '',
      data.roomType || '',
      data.floor || '',
      data.roomNo || '',
      data.assetType || '',
      data.quantity || '1',
      data.brand || '',
      data.model || '',
      data.serial || '',
      data.status || '',
      data.date || new Date().toISOString(),
      data.description || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success', 'message': 'Data Saved' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    // تحرير القفل لتمكين الطلبات الأخرى من الكتابة
    lock.releaseLock();
  }
}

// إرسال البيانات من الجدول إلى الموقع لعرضها
function doGet(e) {
  try {
    const ss = getSheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 'status': 'success', 'data': [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const jsonData = [];
    
    if (data.length > 1) {
      const headers = ['id', 'branch', 'school', 'roomType', 'floor', 'roomNo', 'assetType', 'quantity', 'brand', 'model', 'serial', 'status', 'date', 'description'];
      for (let i = 1; i < data.length; i++) {
        let rowObj = {};
        for (let j = 0; j < headers.length; j++) {
          rowObj[headers[j]] = data[i][j];
        }
        jsonData.unshift(rowObj);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success', 'data': jsonData }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

package kr.co.influential.youngkangapp.util;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * <PRE>
 * 1. 출처 : 아쿠아 샘플앱에서 옮겨옮
 * 2. FileNae  : WeConentManager.java
 * 3. Package  : kr.co.influential.youngkangapp.manager
 * 4. Comment  : 컨텐츠 정보관리
 * 5. 작성자   : 오키토키
 * 6. 작성일   : 2016. 12. 22.
 * </PRE>
 */

public class WeContentManager extends SQLiteOpenHelper {

    private static final String DATABASE = "welaaa.db";
    private static final int VERSION = 1;
    public final String SYTAX = "<so>";

    private  final String DOWNLOAD_CREATE_TABLE = "CREATE TABLE IF NOT EXISTS DOWNLOAD (_id integer primary key autoincrement, " +
            "gId text not null, cId text not null, userId text not null, customerId text not null," +
            "downloadListUrl text not null, contentPath text not null, downloadContext text not null, modified text, " +
            "filepath text not null, RESOLUTION integer default 1,OVERWRITE integer default 0, UPDATERIGHT integer default 0, " +
            "PLAYTIME integer default 0,totalSize text, gTitle text not null, cTitle text not null, groupImg text not null, " +
            "thumbnailImg text not null, audioVideoType text not null, groupTeacherName text not null, cPlayTime text not null , " +
            "groupContentScnt text not null , groupAllPlayTime text not null , view_limitdate text not null ); ";

    private  final String PROGRESS_CREATE_TABLE = "CREATE TABLE IF NOT EXISTS PROGRESS (_id integer primary key autoincrement, " +
            "conClass text not null , gId text not null, cId text not null , totalTime text not null, start_date text not null ," +
            "end_date text not null , playCount text not null , reg_date text not null  )";

    private  final String DOWNLOAD_DROP_TABLE = "DROP TABLE IF EXISTS DOWNLOAD";

    private SQLiteDatabase db;

    public WeContentManager(Context context, String database) {

        super(context, database, null, VERSION);
        String dbPath = context.getApplicationContext().getDatabasePath("welaaa.db").getPath();

        Log.e("WeContentManager " , " WeContentManager dbPath is " + dbPath);
        //  super(context, database, null, VERSION);
        if(db != null && db.isOpen())
        {
            db.close();
        }

        db = getWritableDatabase();
        onCreate(db);
    }

    public void openDb()
    {
        db = getWritableDatabase();
        onCreate(db);
    }

    public String changeSyntax(String data)
    {
        if(data != null){
            data = data.replaceAll("\\'", SYTAX);
        }
        else
            data = "";

        return data;
    }

    public String changeSyntaxRestore(String data)
    {
        if(data != null){
            data = data.replaceAll(SYTAX, "'");
        }
        else
            data = "";

        return data;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        this.db = db;
        try{
            db.execSQL(DOWNLOAD_CREATE_TABLE);
            db.execSQL(PROGRESS_CREATE_TABLE);

        }catch(Exception e){

            e.printStackTrace();
        }

    }
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        this.db = db;
//		dropTable();
        onCreate(db);
    }
    public void createTable(){
        try{

            db.execSQL(DOWNLOAD_CREATE_TABLE);


        }catch(SQLiteException e){

        }
    }
    public void dropTable()
    {
        db.execSQL(DOWNLOAD_DROP_TABLE);
    }

    //EDUMANAGER-226
    public boolean hasProjectName(int id, String projectName)
    {
        if(!db.isOpen())openDb();

        if(projectName != null)
            projectName = projectName.trim();

        String query = "SELECT COUNT(*) AS count FROM PROJECT ";
        query += "WHERE projectname='"+ changeSyntax(projectName) +"'";

        if(id != -1)
            query += "  AND _id <>"+id;

        Cursor c = db.rawQuery(query, null);

        if (c == null)
            return false;

        c.moveToFirst();

        int pos = c.getColumnIndexOrThrow("count");
        String count = c.getString(pos);

        c.close();

        return (Integer.parseInt(count) != 0);
    }

    //cid와 customerid기준으로 변경
    public ArrayList<HashMap<String, Object>> countDownload(String cid, String customerid) throws Exception
    {
        if(!db.isOpen()) openDb();

        String query = "SELECT filepath FROM DOWNLOAD WHERE cId='"+cid+"' AND customerId='"+customerid+"'";
        Cursor c = db.rawQuery(query, null);

        int nCount = 0 ;
        nCount=c.getCount();
        Logger.i("countDownload =>"+ nCount);

        ArrayList<HashMap<String, Object>> data=CursorToDataTable(c);
        return data;
    }
    public int isDownloadExist(String cid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT cId,customerId,filepath FROM DOWNLOAD WHERE cId='"+cid+"'";
        Cursor c = db.rawQuery(query, null);
        int nCount=0;
        nCount=c.getCount();
        if(c!=null){
            c.close();
        }
        return nCount;
    }

    public void updateDownloadFilePath(String cid, String customerid, String filepath) throws Exception
    {

        if(!db.isOpen()){
            openDb();
        }
        String sql="UPDATE DOWNLOAD SET filePath='"+filepath+"'WHERE cId='"+cid+"' AND customerId='"+customerid+"'";
        db.execSQL(sql);
    }

    public void deleteDownLoadList(String filepath)  throws Exception
    {
        if(!db.isOpen()) openDb();
        db.delete("DOWNLOAD", "filepath='"+filepath+"'", null);
    }

    public void downloadAdd(String cId, String userId, String customerId, String downloadListUrl, String contentPath ,
                            String downloadContext , String filepath)  throws Exception {
        if(!db.isOpen()) openDb();
        db.execSQL(String.format("INSERT INTO DOWNLOAD ( cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath) " +
                        "values ( '%s', '%s', '%s', '%s', '%s', '%s', '%s');",
                cId, userId, customerId, downloadListUrl, changeSyntax(contentPath), downloadContext, filepath));
    }
    public void downloadAdd(String cId, String userId, String customerId, String downloadListUrl, String contentPath,
                            String downloadContext , String filepath, int resolution, boolean overwrite, boolean updateright)  throws Exception {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("INSERT INTO DOWNLOAD ( cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath,RESOLUTION,OVERWRITE,UPDATERIGHT) " +
                        "values ( '%s', '%s', '%s', '%s', '%s', '%s', '%s',%d ,%d, %d);",
                cId, userId, customerId, downloadListUrl, changeSyntax(contentPath), downloadContext, filepath,resolution,overwrite ? 1 : 0 , updateright ? 1: 0));
    }

    public void downloadAdd(String gId, String cId, String userId, String customerId, String downloadListUrl, String contentPath,
                            String downloadContext , String filepath, int resolution, boolean overwrite, boolean updateright, int PlayTime, String gTitle, String cTitle, String groupImg, String sumnailImg, String audioVideoType)  throws Exception {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("INSERT INTO DOWNLOAD ( gId, cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath, RESOLUTION, OVERWRITE, UPDATERIGHT, PLAYTIME, gTitle, cTitle, groupImg, sumnailImg, audioVidoType) " +
                        "values ( '%s','%s', '%s', '%s', '%s', '%s', '%s','%s', %d , %d, %d, %d,'%s','%s','%s','%s',%s);",
                gId, cId, userId, customerId, downloadListUrl, changeSyntax(contentPath), downloadContext, filepath, resolution, overwrite ? 1 : 0 , updateright ? 1: 0,PlayTime, gTitle, cTitle, groupImg, sumnailImg, audioVideoType));
    }

    public void downloadAdd(String gId, String cId, String userId, String customerId, String downloadListUrl, String contentPath,
                            String downloadContext , String filepath, int resolution, boolean overwrite, boolean updateright, int PlayTime, String gTitle, String cTitle, String groupImg, String sumnailImg, String audioVideoType,
                            String groupTeacherName , String cPlayTime   )  throws Exception {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("INSERT INTO DOWNLOAD ( gId, cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath, RESOLUTION, OVERWRITE, UPDATERIGHT, PLAYTIME, gTitle, cTitle, groupImg, sumnailImg, audioVidoType , groupTeacherName , cPlayTime) " +
                        "values ( '%s','%s', '%s', '%s', '%s', '%s', '%s','%s', %d , %d, %d, %d,'%s','%s','%s','%s','%s','%s','%s');",
                gId, cId, userId, customerId, downloadListUrl, changeSyntax(contentPath), downloadContext, filepath, resolution, overwrite ? 1 : 0 , updateright ? 1: 0,PlayTime, gTitle, cTitle, groupImg, sumnailImg, audioVideoType , groupTeacherName , cPlayTime));
    }

    public void downloadAdd(String gId, String cId, String userId, String customerId, String downloadListUrl, String contentPath,
                            String downloadContext , String filepath, int resolution, boolean overwrite, boolean updateright, int PlayTime, String gTitle, String cTitle, String groupImg, String sumnailImg, String audioVideoType,
                            String groupTeacherName , String cPlayTime , String groupContentScnt , String groupAllPlayTime   )  throws Exception {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("INSERT INTO DOWNLOAD ( gId, cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath, RESOLUTION, OVERWRITE, UPDATERIGHT, PLAYTIME, gTitle, cTitle, groupImg, sumnailImg, audioVidoType , groupTeacherName , cPlayTime , groupContentScnt , groupAllPlayTime ) " +
                        "values ( '%s','%s', '%s', '%s', '%s', '%s', '%s','%s', %d , %d, %d, %d,'%s','%s','%s','%s','%s','%s','%s','%s','%s');",
                gId, cId, userId, customerId, downloadListUrl, changeSyntax(contentPath), downloadContext, filepath, resolution, overwrite ? 1 : 0 , updateright ? 1: 0,PlayTime, gTitle, cTitle, groupImg, sumnailImg, audioVideoType , groupTeacherName , cPlayTime , groupContentScnt , groupAllPlayTime));
    }

    public void downloadAdd(String gId, String cId, String userId, String customerId, String downloadListUrl, String contentPath,
                            String downloadContext , String filepath, int resolution, boolean overwrite, boolean updateright, int PlayTime, String gTitle, String cTitle, String groupImg, String sumnailImg, String audioVideoType,
                            String groupTeacherName , String cPlayTime , String groupContentScnt , String groupAllPlayTime ,
                            String view_limitdate )  throws Exception {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("INSERT INTO DOWNLOAD ( gId, cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath, RESOLUTION, OVERWRITE, UPDATERIGHT, PLAYTIME, gTitle, cTitle, groupImg, sumnailImg, audioVidoType , groupTeacherName , cPlayTime , groupContentScnt , groupAllPlayTime , view_limitdate ) " +
                        "values ( '%s','%s', '%s', '%s', '%s', '%s', '%s','%s', %d , %d, %d, %d,'%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');",
                gId, cId, userId, customerId, downloadListUrl, changeSyntax(contentPath), downloadContext, filepath, resolution, overwrite ? 1 : 0 , updateright ? 1: 0,PlayTime, gTitle, changeSyntax(cTitle), groupImg, sumnailImg, audioVideoType , groupTeacherName , cPlayTime , groupContentScnt , groupAllPlayTime
                , view_limitdate));
    }

    public void downloadDelete(String gId)
    {
        if(!db.isOpen()) openDb();
        db.execSQL(String.format("DELETE FROM DOWNLOAD WHERE gId='%s' AND NOT totalSize is NULL;",gId));
    }
    public void downloadDelete()
    {
        if(!db.isOpen()) openDb();
        db.execSQL(String.format("DELETE FROM DOWNLOAD;"));
    }
    //
    public void downloadDeleteFromcid(String cId)
    {
        if(!db.isOpen()) openDb();
        db.execSQL(String.format("DELETE FROM DOWNLOAD WHERE cId='%s' AND NOT totalSize is NULL;",cId));
    }
    public void downLoadModify(String modify, String filePath)  throws Exception
    {
        if(!db.isOpen()) openDb();
        db.execSQL(String.format("UPDATE DOWNLOAD SET modified='%s' WHERE filepath='%s';",modify, filePath));
    }

    public void downLoadFileSize(long totalSize, String filePath)  throws Exception
    {
        if(!db.isOpen()) openDb();
        db.execSQL(String.format("UPDATE DOWNLOAD SET totalSize='%s' WHERE filepath='%s';",""+totalSize, filePath));

    }
    public ArrayList<HashMap<String, Object>> getDownLoadModify(String filePath) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = String.format("SELECT modified FROM DOWNLOAD WHERE filepath='%s'", filePath);

        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }
    public ArrayList<HashMap<String, Object>> getDownLoadFileSize(String filePath) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = String.format("SELECT totalSize FROM DOWNLOAD WHERE filepath='%s'", filePath);

        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }
    public void resetDownLoadModify(String filePath) throws Exception
    {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("UPDATE DOWNLOAD SET modified='', totalSize='' WHERE filepath='%s'", filePath));
    }

    //.CDN db에서 그룹키를 기준으로 데이타를 가져온다.
    public ArrayList<HashMap<String, Object>> getGrupDownLoadList() throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT DISTINCT gId FROM DOWNLOAD WHERE NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    public ArrayList<HashMap<String, Object>> getGrupDownLoadList(String gid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT  gTitle, sumnailImg, groupImg, audioVidoType , groupTeacherName , cPlayTime , cTitle , groupContentScnt , groupAllPlayTime , cId , view_limitdate FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
//        String query = "SELECT  gTitle, sumnailImg, groupImg, audioVidoType , groupTeacherName , cPlayTime , cTitle , groupContentScnt , groupAllPlayTime , cId  FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    public ArrayList<HashMap<String, Object>> getGrupDownLoadListALL(String gid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT  * FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
//        String query = "SELECT  gTitle, sumnailImg, groupImg, audioVidoType , groupTeacherName , cPlayTime , cTitle , groupContentScnt , groupAllPlayTime , cId  FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    public ArrayList<HashMap<String, Object>> getGroupFilePath(String gid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT filepath FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    //gId를 기준으로 cId 데이타를 가져온다.
    public ArrayList<HashMap<String, Object>> getContentDownLoadList(String gid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT cId, filepath, totalSize, gTitle, cTitle, sumnailImg, audioVidoType, gId , groupTeacherName ," +
                " cPlayTime FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    //gId를 기준으로 cId 데이타를 가져온다.
    public ArrayList<HashMap<String, Object>> getContentTotalSize(String gid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT totalSize FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    //cId를 기준으로 PLAYTIME  가져온다.
    public ArrayList<HashMap<String, Object>> getPlayTime(String cid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT PLAYTIME FROM DOWNLOAD WHERE cId='"+cid+"'AND NOT PLAYTIME is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    //cId를 기준으로 totalsize를 가져온다.
    public ArrayList<HashMap<String, Object>> getContentTotalSize2(String cid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT totalSize FROM DOWNLOAD WHERE cId='"+cid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    //cId를 기준으로 filepath를 가져온다.
    public ArrayList<HashMap<String, Object>> getFilepath(String cid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT filepath FROM DOWNLOAD WHERE cId='"+cid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }
    //gId를 기준으로 cId 데이타를 가져온다.
    public ArrayList<HashMap<String, Object>> getContentCid(String gid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT cId FROM DOWNLOAD WHERE gId='"+gid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    //cId 기준으로 cTitle , gTitle 데이타를 가져온다.
    public ArrayList<HashMap<String, Object>> getContentTitle(String cid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT cId , gId , gTitle , cTitle FROM DOWNLOAD WHERE cid='"+cid+"'AND NOT totalSize is NULL";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    public ArrayList<HashMap<String, Object>> getDownLoadList() throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT gId, cId, userId, customerId, downloadListUrl, contentPath, downloadContext, filepath,RESOLUTION,OVERWRITE,UPDATERIGHT,PLAYTIME,totalSize FROM DOWNLOAD WHERE NOT totalSize is NULL ";
        Cursor c = db.rawQuery(query, null);
        return CursorToDataTable(c);
    }

    public int getDownLoadedList(String cid, String customerId) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT cId, customerId FROM DOWNLOAD WHERE customerid='"+customerId+"' AND cid='"+cid+"'";

        Cursor c = db.rawQuery(query, null);
        int nCount=0;
        nCount=c.getCount();
        if(c!=null){
            c.close();
        }
        return nCount;
    }

    public int getDownLoadedList(String gId, String cId, String customerId) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT gId, cId, customerId FROM DOWNLOAD WHERE customerid='"+customerId+"'AND gId='"+gId+"' AND cId='"+cId+"'";

        Cursor c = db.rawQuery(query, null);
        int nCount=0;
        nCount=c.getCount();
        if(c!=null){
            c.close();
        }
        return nCount;
    }

    public boolean existCid(String cId){

        boolean existCid = false;

        if(!db.isOpen()) openDb();
        String query = "SELECT cId FROM DOWNLOAD WHERE cId='"+cId+"'AND NOT totalSize is NULL";

        Cursor c = db.rawQuery(query, null);
        int nCount=0;

        nCount=c.getCount();

        if(c!=null){
            c.close();
        }
        if(nCount!=0){
            existCid = true;
        }
        return existCid;
    }

    public boolean existTotalSizeNullCid(String cId){

        boolean existCid = false;

        if(!db.isOpen()) openDb();
        String query = "SELECT cId FROM DOWNLOAD WHERE cId='"+cId+"'AND totalSize is NULL";

        Cursor c = db.rawQuery(query, null);
        int nCount=0;
        nCount=c.getCount();
        if(c!=null){
            c.close();
        }
        if(nCount!=0){
            existCid = true;
        }
        return existCid;
    }
    public ArrayList<HashMap<String, Object>> CursorToDataTable(Cursor c) {
        if (c == null || c.getCount()==0)
            return null;

        String[] names = c.getColumnNames();
        ArrayList<HashMap<String, Object>> dt = new ArrayList<HashMap<String, Object>>();
        while (c.moveToNext()) {
            HashMap<String, Object> dr = new HashMap<String, Object>();
            for (int j = 0; j < names.length; j++) {
                Logger.d("CursorToDataTable name["+names[j]+"]  Value["+c.getString(j)+"]");
                dr.put(names[j], changeSyntaxRestore(c.getString(j)));
            }
            dt.add(dr);
        }

        c.close();
        return dt;
    }

    //get PlayingBlock
    public ArrayList<HashMap<String, Long>> CursorToDataTable2(Cursor c) {
        if (c == null)
            return null;

        String[] names = c.getColumnNames();
        ArrayList<HashMap<String, Long>> dt = new ArrayList<HashMap<String, Long>>();
        while (c.moveToNext()) {
            HashMap<String, Long> dr = new HashMap<String, Long>();
            for (int j = 0; j < names.length; j++) {
                dr.put(names[j], Long.parseLong(c.getString(j)));
            }
            dt.add(dr);
        }

        c.close();
        return dt;
    }
    public ArrayList<HashMap<String, Long>> getPlayingBlock(String cid, String customerid){
        if(!db.isOpen()) openDb();
        String query = "SELECT StartTime, EndTime FROM MEGALMS_PlAYING_BLOCK WHERE customerid='"+customerid+"' AND cid='"+cid+"'";
        Cursor c = db.rawQuery(query, null);

        return CursorToDataTable2(c);
    }

    public void insertProgress(String conClass , String gId , String cId, String totalTime , String PlayCount , String reg_date)  throws Exception {
        if(!db.isOpen()) openDb();

        db.execSQL(String.format("INSERT INTO PROGRESS ( conClass, gId , cId , totalTime, PlayCount , start_date , end_date ,  reg_date) " +
                        "values ( '%s','%s', '%s', '%s', '%s', '%s' , '%s', '%s');",
                        conClass , gId , cId , totalTime , PlayCount ,reg_date , "" , reg_date) );
    }

    public ArrayList<HashMap<String, Object>> getProgressCid(String cId)  throws Exception {
        if(!db.isOpen()) openDb();

        String query = "SELECT conClass, gId , cId , totalTime, PlayCount , reg_date , start_date , end_date FROM PROGRESS WHERE cId='"+cId+"'" ;
        Cursor c = db.rawQuery(query, null);

        return CursorToDataTable(c);
    }


    public int isProgressExist(String cid) throws Exception
    {
        if(!db.isOpen()) openDb();
        String query = "SELECT conClass, gId , cId  FROM PROGRESS WHERE cId='"+cid+"'";
        Cursor c = db.rawQuery(query, null);
        int nCount=0;
        nCount=c.getCount();
        if(c!=null){
            c.close();
        }
        return nCount;
    }

    public void updateProgress(String cid , String reg_date , String type) throws Exception
    {
        if(!db.isOpen()){
            openDb();
        }

        String sql = "";
        if(type.equals("start")){
            sql="UPDATE PROGRESS SET playCount= playCount+1 , start_date='"+reg_date+"' , reg_date='"+reg_date+"' WHERE cId='"+cid+"'";
        }else{
            // totalTime 값을 구할 수 있도록 다시 생각 해주세요 ~
//            sql="UPDATE PROGRESS SET end_date='"+reg_date+"' , reg_date='"+reg_date+"', totalTime='"+reg_date+"'-start_time WHERE cId='"+cid+"'";
        }

        db.execSQL(sql);
    }

    public void deleteProgress(String cid) throws Exception
    {

        if(!db.isOpen()){
            openDb();
        }
        String sql="DELETE FROM PROGRESS WHERE cId='"+cid+"'";
        db.execSQL(sql);
    }

}

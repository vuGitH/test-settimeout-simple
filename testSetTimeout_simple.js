/** @file
* test setTimeout running delay
* only js (no additional node functionality)
*/
var cleaner,
    ob = { 
      tf: undefined  //  fun's run beginning time      
    }; 
/** 
 * setTimeout() function-argument
 */
function fun(){
  var tf = new Date();
  ob.tf = tf.getTime();
  
  console.log('in fun: tf = %s, (tf - t0) = %s',
      ob.tf,
      ob.tf - ob.t0);
 
  clearTimeout(cleaner);
}   
/** 
 * test function 
 * @param {number} delay of process's flow in [milliseconds] 
 * @param {number} timeout value of setTimout()'s second argument 
 */
function test( delay, timeout ){
  console.log('test goes ...');
  var tw,      
      t0 = new Date();
  ob.t0 = t0.getTime();
  
  cleaner = setTimeout(fun,timeout);
  
  var t = 0;  
  while( t < delay ){    // process lag
    tw = new Date();
    t = tw - t0;
  }  
  console.log('finish of test with\n' +
              'delay: %s\n' +
              'timeout: %s\n' +  
              't0 = %s\n' +
              'tw = %s\n' +                                   
              't = %s',
              delay, timeout,
              t0.getTime(),tw.getTime(), t
              );  
}

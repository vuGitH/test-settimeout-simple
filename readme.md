# setTimeout() caveats or misunderstanding. What real timeout value is?

### Usage:

 - Copy content of file testSetTimout_simple.js
 - Paste it into REPL or browser console
 -  Type after console prompt: test( *delay*, *timeout* ), where
    *delay* and *timeout* are digits with meanings:\
    *timeout* - integer number of milliseconds similar to second argument
    of JavaScript setTimeout() function.\
    *delay* - presumable calculation time in milliseconds necessary to 
    carry code in js-block following after the line where setTimeout() 
    function is calling
    Example of test call: 
    ```
    test( 10, 500);
    ```
    or 
    ```
    test(200, 5000 );
    ```
See codes and printing output for details comprehension.
    
### Pretext: 
I observed that effective timeout (lag of launching) of argument-function in
standard JavaScript `setTimeout(fun, timeout)` depends on 
the time necessary to carry out calculation of codes following
the line where `setTimeout()` resides, i.e.

By definition
```
{
  // ...
  t0 = new Date();
  var cleaner = setTimeout(fun,timeout);  
```
means that function `fun` will be launched over approximately `timeout`
milliseconds.
Suppose that after this statement we have a block consuming time
for it's calculation, like this

```
 var t = 0, tw;  
  while( t < delay ){    
    tw = new Date();
    t = tw - t0;
  }
```

'delay' milliseconds will be consumed by this. 

The effective *timeout* over which `fun` will begin to run will be equal to 
`timeout` argument's value **only if** `timeout >= delay`

**Otherwise** the `delay`'s value determines *effective timeout*.

Testing code used:

```
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
```

Table bellow illustrates testing result:


#### in node.js REPL

| delay | timeout | *effective timeout* |
|-------|-------|---------------------|
| 1000 | 1000 | 1011 |
| 1000 | 1000 | 1007 |
| 50 | 50 | 56 |
| 50 | 50 | 56 |
| 100 |2000 | 2007 |
| 200 | 5000 | 5001 |
| 500 | 100 | 502 |
| 1000 | 100 | 1007 |
| 1000 | 50 | 1007 |
| 1000 | 50 | 1005 |
| 1000 | 50 | 1006 |
| 2000 | 50 | 2006 |
| 2000 | 50 | 2006 |
| 2000 | 50 | 2006 |
| 4000 | 50 | 4006 |
| 4000 | 50 | 4006 |
| 4000 | 3000 | 4007 |

#### in Google Chrome console

| delay | timeout | *effective timeout* |
|-------|-------|---------------------|
| 1000 | 1000 | 1003 |
| 1000 | 1000 | 1001 |
| 50 | 50 | 51 |
| 50 | 50 | 52 |
| 100 |2000 | 2000 |
| 200 | 5000 | 5001 |
| 500 | 100 | 502 |
| 1000 | 100 | 1004 |
| 1000 | 50 | 1002 |
| 1000 | 50 | 1002 |
| 1000 | 50 | 1002 |
| 2000 | 50 | 2001 |
| 2000 | 50 | 2001 |
| 2000 | 50 | 2001 |
| 4000 | 50 | 4003 |
| 4000 | 50 | 4001 |
| 4000 | 3000 | 4006 |

#### in MSE console

| delay | timeout | *effective timeout* |
|-------|-------|---------------------|
| 1000 | 1000 | 1003 |
| 1000 | 1000 | 1004 |
| 50 | 50 | 53 |
| 50 | 50 | 56 |
| 100 |2000 | 2004 |
| 200 | 5000 | 5011 |
| 500 | 100 | 505 |
| 1000 | 100 | 1004 |
| 1000 | 50 | 1006 |
| 1000 | 50 | 1003 |
| 1000 | 50 | 1003 |
| 2000 | 50 | 2005 |
| 2000 | 50 | 2001 |
| 2000 | 50 | 2006 |
| 4000 | 50 | 4003 |
| 4000 | 50 | 4002 |
| 4000 | 3000 | 4002 |

Comments or editions Welcome!
Vladimir Uralov
vladimir@uralov.com
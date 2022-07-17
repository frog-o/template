
/* HELPER */

function helper ( exp, options ) {

  const regex = /\${(\S+)}/g,
        compiled = exp.replace ( regex, ( match, pull ) => options.hash[pull] );

  return(0, eval) ( compiled );

}

/* EXPORT */

export default helper;

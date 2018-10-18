function init_vars_game() {

        lienzo = $("#canvas");
        w_lienzo = lienzo.parent();
        ctx = lienzo[0].getContext('2d');
        rec = new game_objet(ctx,{color: "gray"});
        dino = new c_dino(ctx);
      }

      function update_game() {
        dino.jump = false;
        puntaje_total = 0;
        rec.ctx_update({w: p_ctx.w, h: 200, x: 0, y: p_ctx.h - 200}).draw();
        dino.ctx_update({x: 20, y: p_ctx.h - (200 + dino.size.h)}).draw();
        o_captus = [];

        for (var i = 0; i < 5; i++) {
          var pos = (Math.random() * 200) + 500;
          var my_c = o_captus.length == 0 ? p_ctx.w : o_captus[o_captus.length - 1].x + pos;
          o_captus.push(new c_captus(ctx,{floor: p_ctx.h - rec.size.h, x: my_c}).draw());
        }
        o_ptero = [];


      }

      function draw_game() {
        ctx.fillStyle = "white"; //Color del fondo del juego
        ctx.fillRect(0,0,p_ctx.w,p_ctx.h); //pintado del fondo

        rec.draw();
        var create_new = 0;
        for (var i = 0; i < o_captus.length; i++) {
          o_captus[i].draw(); if (o_captus[i].x < -50) {o_captus.splice(i, 1); i--; create_new++;}
          // si rebasa la cordena en x, se elimina el elemento y se le notifica al sistema que es libre de crear un nuevo ente
        }
        for (var i = 0; i < o_ptero.length; i++) {
          o_ptero[i].draw(); if (o_ptero[i].x < -50) {o_ptero.splice(i, 1); i--; create_new++;}
        }

        for (var i = 0; i < create_new; i++) {
          var pos = (Math.random() * 200) + 500;
          var t_create = parseInt(Math.random() * 2);
          //
          var my_c = o_captus.length === 0 ? 500 : o_captus[o_captus.length - 1].x;
          var my_p = o_ptero.length === 0 ? 500 : o_ptero[o_ptero.length - 1].x;

          if (t_create % 2 === 0) o_ptero.push(new c_pterodactil(ctx,{floor: p_ctx.h - rec.size.h, x: ((my_c > my_p ? my_c : my_p) + pos)}));
          else o_captus.push(new c_captus(ctx,{floor: p_ctx.h - rec.size.h, x: ((my_c > my_p ? my_c : my_p) + pos)}));
        }
        if(collision_enable){
          for (var i = 0; i < o_captus.length; i++) if (o_captus[i].colision(dino)) update_game();
          for (var i = 0; i < o_ptero.length; i++) if (o_ptero[i].colision(dino)) update_game();
        }




        dino.draw();
      }

      function update_size(){
        console.log(lienzo);

        lienzo.attr({width: w_lienzo.width(), height: w_lienzo.height()});
        p_ctx.w = w_lienzo.width()
        p_ctx.h = w_lienzo.height()
      }

      function STAR_ALL_GAME(){
        init_vars_game();
        update_size();
        update_game();
        setInterval(function () {
          global_time++;
          for (var i = 0; i < o_captus.length; i++) o_captus[i].add_x(-4);
          for (var i = 0; i < o_ptero.length; i++) o_ptero[i].add_x(-4);


          puntaje_total++;
          dino.jump_dino();
          draw_game();
          if(puntaje_total ==0){
            console.log('GOOD GAME VATO');
            sound.currentTime = 0;
          }
          ctx.font = "20px Calibri";
          ctx.fillText(parseInt(puntaje_total/10)+"",10,50);
        }, FPS);
      }


      $(window).resize(function () {update_size();
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,p_ctx.w,p_ctx.h);

        rec.ctx_update({y: p_ctx.h - 200, w: p_ctx.w}).draw();
        dino.ctx_update({y: p_ctx.h - 250}).draw();
        //for (var i = 0; i < o_ptero.length; i++) o_ptero[i].ctx_update({y: p_ctx.h - 300}).draw();
        //for (var i = 0; i < o_ptero.length; i++) o_ptero[i].ctx_update({y: p_ctx.h - 300}).draw();
      });
      $(document).keydown(function (e) {
        if (e.keyCode === KEYS.UP) A_KEYS.UP = true;
        if (e.keyCode === KEYS.LEFT) A_KEYS.LEFT = true;
        if (e.keyCode === KEYS.RIGHT) A_KEYS.RIGHT = true;
        if (e.keyCode === KEYS.DOWN) A_KEYS.DOWN = true;
      });
      $(document).keyup(function (e) {
        if (e.keyCode === KEYS.UP) A_KEYS.UP = false;
        if (e.keyCode === KEYS.LEFT) A_KEYS.LEFT = false;
        if (e.keyCode === KEYS.RIGHT) A_KEYS.RIGHT = false;
        if (e.keyCode === KEYS.DOWN) A_KEYS.DOWN = false;
      });
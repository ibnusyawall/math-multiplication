$(document).ready(function() {
    // eruda.init(); // debug on chrome android.
    $('#on-room').hide()
    $('#on-board').hide()

    var score = 1
    var db = window.localStorage

    window.board = {}
    window.timeouts = []

    if (!db.getItem('math:score')) db.setItem('math:score', 0)

    $('#menu-score').text(`Best Score: ${db.getItem('math:score')}`)

    $('#play').on('click', function() {
        $('#on-home').hide()
        $('#on-board').hide()
        $('#on-room').show()
        mulai()
    })

    $('#home').on('click', function() {
        window.location = window.location
    })

    $('#restart').on('click', function() {
        $('#on-board').hide()
        $('#on-home').hide()
        $('#on-room').show()
        $('#trophy').text('0') // reset trophy

        mulai()
    })

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    const randomArray = Array(10).fill().map((_, index) => index += 1)

    function mulai() {
        clearAllTimeout()

        var soal1 = randomArray[~~(Math.random() * randomArray.length)]
        var soal2 = randomArray[~~(Math.random() * randomArray.length)]

        var jawaban = eval(`${soal1}*${soal2}`)
        var randAsk = [soal1, soal2, jawaban][~~(Math.random() * 3)]

        var randId = $('#btn-span button[id]').map(function() {
            return this.id
        }).get()

        var randIdAnswer = randId[~~(Math.random() * randId.length)]

        randId.filter(v => v != randIdAnswer).forEach((v, i) => {
            var otherAns = arrRand(randAsk, randAsk + 3)

            $(`#${v}`).attr('value', `${otherAns == otherAns ? otherAns + 2 : otherAns}`)
            $(`#${v}`).html(`${otherAns == otherAns ? otherAns + 2 : otherAns}`)
        })

        $(`#${randIdAnswer}`).attr('value', randAsk)
        $(`#${randIdAnswer}`).html(randAsk)

        var soal = `${soal1} × ${soal2} = ${jawaban}`.replace(randAsk, '?')

        $('#soal').text(soal);

        (function delayLoop(i) {
            var timer = setTimeout(function() {
                $('div .progress-bar').attr('aria-valuenow', `${10 - i}0`)
                $('div .progress-bar').css('width', `${10 - i}0%`)
                $('#clock').text(`${i}`)
                if (i == 1) showLose()

                if (--i) delayLoop(i)
            }, 1000)
            window.timeouts.push(timer)
        })(10);

        window.board = {
            soal1: soal1,
            soal2: soal2,
            randAsk: randAsk,
            jawaban: jawaban,
        }
        return
    }

    function clearAllTimeout() {
        for (var i = 0, z = window.timeouts.length; i < z; i++) {
            clearTimeout(window.timeouts[i])
        }
        window.timeouts = []
        return
    }

    function showLose() {
        $('#correct-answer').text(`Correct Answer: ${window.board.soal1} × ${window.board.soal2} = ${window.board.jawaban}`)
        $('#scoreLose').text(`${score == 1 ? '0' : score - 1}`)
        score = 1
        $('#on-board').show()
        $('#on-room').hide()
        return
    }

    $('button[name="answers"]').on('click', function() {
        if (window.board.randAsk == this.value) {
            $(this).addClass('btn-outline-success').removeClass('btn-outline-dark')
            var skor = parseInt(db.getItem('math:score'))
            $('#trophy').text(score++)
            mulai()
            setTimeout(() => {
                $(this).addClass('btn-outline-dark').removeClass('btn-outline-success')
            }, 1000)
        } else {
            navigator.vibrate(25)
            $(this).addClass('btn-outline-danger').removeClass('btn-outline-dark')
            var skor = parseInt(db.getItem('math:score'))
            if ((score >= skor)) db.setItem('math:score', score - 1)
            showLose()
            setTimeout(() => {
                $(this).addClass('btn-outline-dark').removeClass('btn-outline-danger')
            }, 1000)
            clearAllTimeout()
        }
    })

    function arrRand(from, to) {
        var tmp = []
        for (i = from; i <= to + 5; i++) {
            tmp.push(i)
        }
        var result = [--from, ...tmp][~~(Math.random() * tmp.length + 1)]
        if (result == from) arrRand(from, to)
        return result
    }
})
